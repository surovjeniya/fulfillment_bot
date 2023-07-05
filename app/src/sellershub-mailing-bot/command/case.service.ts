import { Injectable, Logger } from '@nestjs/common';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Utm } from '../enum/utm.enum';

@Injectable()
export class CaseService {
  private readonly logger = new Logger(CaseService.name);
  constructor() {}

  async emptyCaseService(ctx: TelegrafContext) {
    try {
      await ctx.reply('Empty case');
    } catch (e) {
      this.logger.error(`Error from ${this.emptyCaseService.name}`, e.message);
    }
  }

  async unitEconomicCase(ctx: TelegrafContext) {
    try {
      await ctx.reply(Utm.unit_economic_guide);
    } catch (e) {
      this.logger.error(`Error from ${this.unitEconomicCase.name}`, e.message);
    }
  }
  async fourteenthOrderCase(ctx: TelegrafContext) {
    try {
      await ctx.reply(Utm.fourteenth_order);
    } catch (e) {
      this.logger.error(
        `Error from ${this.fourteenthOrderCase.name}`,
        e.message,
      );
    }
  }
}
