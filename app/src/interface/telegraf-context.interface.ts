import { Context } from 'telegraf';
import { Contact, Message, Update } from 'telegraf/typings/core/types/typegram';

export enum Step {
  one = 'one',
  two = 'two',
  three = 'three',
  four = 'four',
  five = 'five',
  six = 'six',
  seven = 'seven',
  eight = 'eight',
}

export interface TelegrafContext extends Context {
  session: {
    order: string;
  };
  from: any;
  update: Update & {
    message: Message & {
      text?: string;
      contact?: Contact;
    };
  };
}
