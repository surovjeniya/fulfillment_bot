import { Logger } from '@nestjs/common';
import { Action, Command, Ctx, On, Update } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Utm } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Update()
export class CommandUpdate {
  private readonly logger = new Logger(CommandUpdate.name);
  constructor(private readonly userService: UserService) {}

  async validateUser(ctx: TelegrafContext) {
    const user = await this.userService.findOne(String(ctx.from.id));
    if (user) {
      return user;
    } else {
      return await this.userService.create({
        telegram_id: String(ctx.from.id),
        first_name: ctx.from.first_name ? ctx.from.first_name : null,
        last_name: ctx.from.last_name ? ctx.from.last_name : null,
        username: ctx.from.username ? ctx.from.username : null,
        utm: !!ctx.update.message.text.match(Utm.fulfillment_assistant_lending)
          ? Utm.fulfillment_assistant_lending
          : !!ctx.update.message.text.match(Utm.registration_on_course)
          ? Utm.registration_on_course
          : null,
      });
    }
  }

  @Command('start')
  async start(@Ctx() ctx: TelegrafContext) {
    ctx.session.order = null;
    await this.validateUser(ctx);

    try {
      if (!!ctx.update.message.text.match(Utm.registration_on_course)) {
        const { username, first_name, last_name, id: telegram_id } = ctx.from;
        // prettier-ignore
        const message = `Регистрация на курс по ФФ\n\nTelegram_id:${telegram_id}\nИмя: ${first_name ? first_name : 'отсутствует'}\nФамилия: ${last_name ? last_name : 'отсутствует'}\nИмя пользователя: ${username ? `https://t.me/${username}` : 'отсутствует'}\nДата регистрации: ${new Date().toLocaleDateString('ru-RU', {
          timeZone: 'Europe/Moscow',
        })}\nВремя регистрации: ${new Date().toLocaleTimeString('ru-RU', {
          timeZone: 'Europe/Moscow',
        })}`;
        await ctx.replyWithPhoto(
          `https://sellershub.ru/api/uploads/Privetstvie_ec4726b7d5.png?updated_at=2023-05-24T10:06:24.090Z`,
          {
            caption: `Спасибо за регистрацию!🎉\n\nМы оповестим вас о запуске курса, чтобы вы успели приобрести обучение по самой выгодной цене⚡️.`,
          },
        );

        await ctx.telegram.sendMessage(54452505, message);
      } else {
        await ctx.replyWithPhoto(
          'https://sellershub.ru/api/uploads/Privetstvie_32246ded80.png?updated_at=2023-04-29T13:41:34.693Z',
          {
            caption: `${
              ctx.from.first_name ? ctx.from.first_name : 'Добро пожаловать'
            }, вы присоединились к Fullfilment Assist Bot!🎉\n\nТеперь вам доступен эксклюзивный инструмент по подбору фулфилмента.\n\Нажмите "разместить заявку" и введите данные. Это быстро.`,
            disable_notification: true,
            reply_markup: {
              one_time_keyboard: true,
              force_reply: true,
              resize_keyboard: true,
              keyboard: [
                [
                  {
                    text: 'Разместить заявку',
                  },
                ],
              ],
            },
          },
        );
      }
    } catch (e) {
      this.logger.error('Error from start', e.message);
    }
  }

  @On('message')
  async messageHandler(@Ctx() ctx: TelegrafContext) {
    try {
      if (ctx.update.message.text.match('Разместить заявку')) {
        await ctx.deleteMessage(ctx.update.message.message_id - 1);

        await ctx.deleteMessage();
        await ctx.reply(`
        Ответьте одним сообщением на наши вопросы:\n\nСхема работы: (ФБО , ФБС)\nНа склады каких маркетплейсов нужно делать поставку?\nКатегория товара?\nОбщее количество товаров ?\nОбщее количество артикулов?\nГабариты товара д*ш*в?\nВид упаковки который необходим?\nДоп.услуги: проверка на брак, доп.маркировка\nКонтакты для связи.`);
      }
      if (!ctx.update.message.text.match('Разместить заявку')) {
        ctx.session.order = ctx.update.message.text;
        await ctx.reply(ctx.update.message.text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Отправить заявку', callback_data: 'send-order' }],
            ],
          },
        });
      }
    } catch (e) {
      this.logger.error('Error from messageHandler', e.message);
    }
  }

  @Action('send-order')
  async sendOrder(@Ctx() ctx: TelegrafContext) {
    try {
      await ctx.deleteMessage();
      if (ctx.session.order && ctx.session.order.length) {
        await ctx.telegram.sendMessage(
          54452505,
          `Текст заявки: ${ctx.session.order}\nОт кого: ${
            ctx.from.username ? ctx.from.username : ctx.from.id
          }`,
        );
        await ctx.reply(
          'Ваша заявка принята.В течении 10 минут с вами свяжется менеджер.',
        );
        await this.userService.update(String(ctx.from.id), ctx.session.order);
      }
    } catch (e) {
      this.logger.error('Error from sendOrder', e.message);
    }
  }
}
