import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectBot } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { SendMessageToUsersDto } from 'src/mailing/dto/send-message-to-users.dto';
import { Telegraf, TelegramError } from 'telegraf';
import { Repository } from 'typeorm';
import { MailingBotUserEntity } from '../entity/mailing-bot-user.entity';
import { SellersHubMailingBotUserService } from '../sellershub-mailing-bot.service';
import { CallbackResponseTextEntity } from './callback-response-text.entity';
@Injectable()
export class MailingService {
  private readonly logger = new Logger(MailingService.name);
  constructor(
    @InjectBot('sellershub_mailing_bot')
    private readonly bot: Telegraf<TelegrafContext>,
    private readonly sellersHubMailingBotUserService: SellersHubMailingBotUserService,
    @InjectRepository(CallbackResponseTextEntity)
    private readonly callbackResponseTextRepository: Repository<CallbackResponseTextEntity>,
  ) {}

  asyncEachIterator(arr: any[], fn: any) {
    let i = 0;
    const last = arr.length - 1;
    const next = (i) => {
      setTimeout(() => {
        fn(arr[i], i);
        if (i !== last) next(++i);
      }, 500);
    };
    next(i);
  }

  async sendMessageToUsers(dto: SendMessageToUsersDto) {
    try {
      let callbackMessageResponse: CallbackResponseTextEntity = null;
      if (dto.callback_response_text) {
        callbackMessageResponse = this.callbackResponseTextRepository.create({
          text: dto.callback_response_text,
        });
        await this.callbackResponseTextRepository.save(callbackMessageResponse);
      }
      const users = await this.sellersHubMailingBotUserService.findUsers();

      this.asyncEachIterator(users, (user: MailingBotUserEntity, i: number) => {
        if (dto.image_path) {
          this.bot.telegram
            .sendPhoto(user.telegram_id, dto.image_path, {
              caption: dto.message,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: dto.with_btn
                  ? [
                      [
                        {
                          text: dto.btn_text,
                          url: dto.btn_link ? dto.btn_link : null,
                          callback_data: dto.with_callback
                            ? `mailing-analytics-update/${callbackMessageResponse.id}`
                            : null,
                        },
                      ],
                    ]
                  : [],
              },
            })
            .catch((error: TelegramError) => {
              console.log({
                index: i,
                id: user.telegram_id,
                username: user.username ? user.username : null,
                status: 'Error',
                message: error.message,
              });
            })
            .then(() =>
              console.log({
                index: i,
                id: user.telegram_id,
                username: user.username ? user.username : null,
                status: 'Success',
              }),
            );
        }
        if (!dto.image_path) {
          this.bot.telegram
            .sendMessage(user.telegram_id, dto.message, {
              parse_mode: 'HTML',
            })
            .then(() =>
              console.log({
                index: i,
                id: user.telegram_id,
                username: user.username ? user.username : null,
                status: 'Success',
              }),
            )
            .catch((error: TelegramError) =>
              console.log({
                index: i,
                id: user.telegram_id,
                username: user.username ? user.username : null,
                status: 'Error',
                message: error.message,
              }),
            );
        }
      });
    } catch (e) {
      this.logger.error(
        `Error from ${this.sendMessageToUsers.name}`,
        e.message,
      );
    }
  }
}
