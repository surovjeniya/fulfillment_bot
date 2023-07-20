import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CallbackResponseText } from './entity/callback-response-text.entity';
import { MailingUpdate } from './mailiing.update';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([CallbackResponseText])],
  providers: [MailingService, MailingUpdate],
  controllers: [MailingController],
})
export class MailingModule {}
