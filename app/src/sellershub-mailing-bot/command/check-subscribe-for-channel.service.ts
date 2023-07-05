import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Telegraf } from 'telegraf';
import { CHATS_FOR_SUBSCRIBE } from '../constant/chats-for-subscribe.constant';

@Injectable()
export class CheckSubscribeForChannelService {
  private readonly logger = new Logger(CheckSubscribeForChannelService.name);
  constructor(
    @InjectBot('sellershub_mailing_bot')
    private readonly bot: Telegraf<TelegrafContext>,
  ) {}

  async checkSubscription(ctx: TelegrafContext) {
    try {
      const membersStatus = [];
      for await (const chat of CHATS_FOR_SUBSCRIBE) {
        const isMember = await this.bot.telegram.getChatMember(
          chat.chatId,
          ctx.from.id,
        );
        if (isMember.status !== 'left') {
          membersStatus.push(true);
        } else {
          membersStatus.push(false);
        }
      }

      if (!membersStatus.filter((item) => !item).length) {
        return true;
      } else {
        await ctx.reply('Прежде чем продолжить, подпишитесь на наши чаты', {
          disable_notification: true,
          reply_markup: {
            inline_keyboard: CHATS_FOR_SUBSCRIBE.map((chat) => [
              {
                text: chat.chatTitle,
                url: chat.chatUrl,
              },
            ]),
          },
        });
      }
      return false;
    } catch (e) {
      this.logger.error(`Error from ${this.checkSubscription.name}`, e.message);
    }
  }
}
