import { Module } from '@nestjs/common';
import { CaseService } from './case.service';
import { CheckSubscribeForChannelService } from './check-subscribe-for-channel.service';
import { CommandUpdate } from './command.update';

@Module({
  providers: [CommandUpdate, CaseService, CheckSubscribeForChannelService],
})
export class CommandModule {}
