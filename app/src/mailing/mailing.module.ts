import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';

@Module({
  imports: [UserModule],
  providers: [MailingService],
  controllers: [MailingController],
})
export class MailingModule {}
