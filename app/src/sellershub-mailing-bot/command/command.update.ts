import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Telegraf } from 'telegraf';
import { Utm } from '../enum/utm.enum';
import { CaseService } from './case.service';
import { CheckSubscribeForChannelService } from './check-subscribe-for-channel.service';

@Update()
export class CommandUpdate {
  constructor(
    @InjectBot('sellershub_mailing_bot')
    private readonly bot: Telegraf<TelegrafContext>,
    private readonly caseService: CaseService,
    private readonly checkSubscribeForChannelService: CheckSubscribeForChannelService,
  ) {}

  checkUtm(ctx: TelegrafContext) {
    const utm = ctx.update.message.text.split(' ').length
      ? ctx.update.message.text.split(' ')[1]
      : null;
    return utm;
  }

  async checkCaseByUtm(ctx: TelegrafContext) {
    const utm = this.checkUtm(ctx);
    switch (utm) {
      case Utm.fourteenth_order:
        await this.caseService.fourteenthOrderCase(ctx);
        break;
      case Utm.unit_economic_guide:
        await this.caseService.unitEconomicCase(ctx);
        break;
      default:
        await this.caseService.emptyCaseService(ctx);
        break;
    }
  }

  @Start()
  async startHandler(@Ctx() ctx: TelegrafContext) {
    const checkSubscription =
      await this.checkSubscribeForChannelService.checkSubscription(ctx);
    if (checkSubscription) {
      await this.checkCaseByUtm(ctx);
    }
  }
}
