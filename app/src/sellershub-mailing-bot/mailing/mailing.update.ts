import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Repository } from 'typeorm';
import { CallbackResponseTextEntity } from './callback-response-text.entity';

@Update()
export class MailingUpdate {
  private readonly logger = new Logger(MailingUpdate.name);
  constructor(
    @InjectRepository(CallbackResponseTextEntity)
    private readonly callbackResponseTextRepository: Repository<CallbackResponseTextEntity>,
  ) {}

  @Action(/(?<=mailing-analytics-update\/).*/)
  async mailingHandler(@Ctx() ctx: TelegrafContext) {
    try {
      //@ts-ignore
      const messageId = ctx.match[0];
      const message = await this.callbackResponseTextRepository.findOne({
        where: { id: messageId },
      });

      await ctx.reply(message.text, { parse_mode: 'HTML' });
      await ctx.telegram.sendMessage(
        '671646655',
        `id: ${ctx.from.id},\nbot: ${'analytics'}`,
      );
    } catch (error) {
      this.logger.error(`Error from mailingHandler`, error.message);
    }
  }
}
