import { Logger } from '@nestjs/common';
import { Action, Command, Ctx, On, Update } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interface/telegraf-context.interface';
import { Utm } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { sellersHubApi } from 'src/utils/sellershub-api.utils';
import * as passwordGenerator from 'generate-password';

const admins: {
  username: string;
  telegram_id: number;
}[] = [
  {
    username: '@nnaastyyaa',
    telegram_id: 5135704563,
  },
  {
    username: '@koiEugene',
    telegram_id: 54452505,
  },
  {
    username: '@polina_nb',
    telegram_id: 5819723114,
  },
  {
    username: '@polinaibich',
    telegram_id: 397918359,
  },
];

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
          : !!ctx.update.message.text.match(Utm.fast_registration)
          ? Utm.fast_registration
          : null,
      });
    }
  }

  @Command('start')
  async start(@Ctx() ctx: TelegrafContext) {
    ctx.session.order = null;
    await this.validateUser(ctx);
    try {
      if (!!ctx.update.message.text.match(Utm.fast_registration)) {
        await ctx.reply(
          'Для быстрой регистрации нажмите кнопку "Показать контакт".',
          {
            reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: true,
              force_reply: true,
              keyboard: [
                [
                  {
                    text: 'Показать контакт',
                    request_contact: true,
                  },
                ],
              ],
            },
          },
        );
      }
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

        for await (const admin of admins) {
          await ctx.telegram.sendMessage(admin.telegram_id, message);
        }
      }
      if (
        !ctx.update.message.text.match(Utm.fast_registration) &&
        !ctx.update.message.text.match(Utm.registration_on_course)
      ) {
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

  @On('contact')
  async contactHandler(@Ctx() ctx: TelegrafContext) {
    try {
      const { phone_number, user_id } = ctx.update.message.contact;
      const password = passwordGenerator.generate({
        length: 16,
        symbols: false,
        numbers: true,
        uppercase: true,
        lowercase: true,
      });
      const user = await sellersHubApi.registrationByPhoneHumber({
        phone_number:
          phone_number[0] === '+' ? phone_number.slice(1) : phone_number,
        password,
        registered_from_bot: true,
        telegram_id: user_id,
        username: ctx.from.username ? ctx.from.username : null,
      });
      if (user === 'used') {
        await ctx.reply('Вы уже зарегестрированы.');
      }
      //@ts-ignore
      if (user.jwt) {
        await ctx.reply(
          `Спасибо за регистрацию.\nВаши данные для входа на сайт:\nЛогин: ${
            phone_number[0] === '+' ? phone_number.slice(1) : phone_number
          }\nПароль: ${password}\n <a href="https://sellershub.ru">Перейти на сайт</a>`,
          {
            parse_mode: 'HTML',
          },
        );
      }
    } catch (e) {
      this.logger.error(`Error from  ${this.contactHandler.name}`, e.message);
    }
  }

  @On('message')
  async messageHandler(@Ctx() ctx: TelegrafContext) {
    try {
      if (ctx.update.message.text.match('Разместить заявку')) {
        await ctx.deleteMessage();
        await ctx.reply(
          `Ответьте одним сообщением на наши вопросы:\n\n1. Категория товара, требующая обработку. Ее примерные габариты.\n2. Количество товаров и артикулов в поставке.\n3. Требуется ли забор груза? Откуда?\n4. Опишите, что необходимо сделать с товаром. Какая требуется упаковка.\n5. Система работы: FBO или FBS?\n6. Куда необходимо отправить товар?\n7. Примечания от вас: пожелания или моменты, которые хотели бы уточнить.\n8. Контакты для связи.\n`,
        );
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
        for await (const admin of admins) {
          await ctx.telegram.sendMessage(
            admin.telegram_id,
            `Текст заявки: ${ctx.session.order}\nОт кого: ${
              ctx.from.username ? ctx.from.username : ctx.from.id
            }`,
          );
        }
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
