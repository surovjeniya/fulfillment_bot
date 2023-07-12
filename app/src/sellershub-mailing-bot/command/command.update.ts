import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Telegraf } from 'telegraf';
import { Utm } from '../enum/utm.enum';
import { SellersHubMailingBotUserService } from '../sellershub-mailing-bot.service';
import { CaseService } from './case.service';
import { CheckSubscribeForChannelService } from './check-subscribe-for-channel.service';

@Update()
export class CommandUpdate {
  constructor(
    @InjectBot('sellershub_mailing_bot')
    private readonly bot: Telegraf<TelegrafContext>,
    private readonly caseService: CaseService,
    private readonly checkSubscribeForChannelService: CheckSubscribeForChannelService,
    private readonly sellersHubMailingBotUserService: SellersHubMailingBotUserService,
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
    const user = await this.sellersHubMailingBotUserService.findUser({
      where: { telegram_id: ctx.from.id },
    });
    if (!user) {
      await this.sellersHubMailingBotUserService.createUser({
        first_name: ctx.from.first_name ? ctx.from.first_name : null,
        last_name: ctx.from.last_name ? ctx.from.last_name : null,
        telegram_id: ctx.from.id,
        username: ctx.from.username ? ctx.from.username : null,
        utm: this.checkUtm(ctx),
      });
    }
    const checkSubscription =
      await this.checkSubscribeForChannelService.checkSubscription(ctx);
    if (checkSubscription) {
      await this.checkCaseByUtm(ctx);
    }
  }
}
