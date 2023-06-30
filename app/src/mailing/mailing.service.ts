import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Telegraf, TelegramError } from 'telegraf';
import { SendMessageToUsersDto } from './dto/send-message-to-users.dto';

@Injectable()
export class MailingService {
  private readonly logger = new Logger(MailingService.name);
  constructor(
    private readonly userService: UserService,
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
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
      const users = await this.userService.find();
      this.asyncEachIterator(users, (user: UserEntity, i: number) => {
        if (dto.image_path) {
          this.bot.telegram
            .sendPhoto(user.telegram_id, dto.image_path, {
              caption: dto.message,
              parse_mode: 'HTML',
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
