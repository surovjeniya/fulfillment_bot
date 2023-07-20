import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { MailingUpdate } from './mailing.update';
import { CommandModule } from '../command/command.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallbackResponseTextEntity } from './callback-response-text.entity';
@Module({
  imports: [
    CommandModule,
    TypeOrmModule.forFeature([CallbackResponseTextEntity]),
  ],
  controllers: [MailingController],
  providers: [MailingService, MailingUpdate],
})
export class MailingModule {}
