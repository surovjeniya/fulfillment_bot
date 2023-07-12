import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingBotUserEntity } from '../entity/mailing-bot-user.entity';
import { SellersHubMailingBotUserService } from '../sellershub-mailing-bot.service';
import { CaseService } from './case.service';
import { CheckSubscribeForChannelService } from './check-subscribe-for-channel.service';
import { CommandUpdate } from './command.update';

@Module({
  imports: [TypeOrmModule.forFeature([MailingBotUserEntity])],
  providers: [
    CommandUpdate,
    CaseService,
    CheckSubscribeForChannelService,
    SellersHubMailingBotUserService,
  ],
})
export class CommandModule {}
