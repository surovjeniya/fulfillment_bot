import { Injectable, Logger } from '@nestjs/common';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Utm } from '../enum/utm.enum';

@Injectable()
export class CaseService {
  private readonly logger = new Logger(CaseService.name);
  constructor() {}

  async emptyCaseService(ctx: TelegrafContext) {
    try {
      await ctx.reply('Наши гайды:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Гайд по расшифровке 14-ого отчёта от Селлерсхаб',
                url: 'https://sellershub.ru/api/uploads/order_6a1d7151c8.pdf?updated_at=2023-07-06T14:02:02.707Z',
              },
              {
                text: 'Гайд Unit-экономике от Селлерсхаб',
                url: 'https://sellershub.ru/api/uploads/Gajd_Yunit_ekonomika_230c9d9768.pdf?updated_at=2023-07-11T13:32:11.431Z',
              },
            ],
          ],
        },
      });
    } catch (e) {
      this.logger.error(`Error from ${this.emptyCaseService.name}`, e.message);
    }
  }

  async unitEconomicCase(ctx: TelegrafContext) {
    try {
      const loaderMessage = await ctx.reply('💫', {
        disable_notification: true,
      });
      await ctx.sendDocument(
        {
          url: 'https://sellershub.ru/api/uploads/Gajd_Yunit_ekonomika_230c9d9768.pdf?updated_at=2023-07-11T13:32:11.431Z',
          filename: 'Гайд по Unit-экономике от Селлерсхаб.pdf',
        },
        {
          caption: 'Держите гайд по Unit-экономике.',
        },
      );
      await ctx.deleteMessage(loaderMessage.message_id);
    } catch (e) {
      this.logger.error(`Error from ${this.unitEconomicCase.name}`, e.message);
    }
  }
  async fourteenthOrderCase(ctx: TelegrafContext) {
    try {
      const loaderMessage = await ctx.reply('💫', {
        disable_notification: true,
      });
      await ctx.sendDocument(
        {
          url: 'https://sellershub.ru/api/uploads/order_6a1d7151c8.pdf?updated_at=2023-07-06T14:02:02.707Z',
          filename: 'Гайд по расшифровке 14-ого отчёта от Селлерсхаб.pdf',
        },
        {
          caption:
            'Держите гайд по расшифровке 14-го отчета. Узнайте, от чего зависит конверсия продаж.📈',
        },
      );
      await ctx.deleteMessage(loaderMessage.message_id);
    } catch (e) {
      this.logger.error(
        `Error from ${this.fourteenthOrderCase.name}`,
        e.message,
      );
    }
  }
}
