import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageToUsersDto } from 'src/mailing/dto/send-message-to-users.dto';
import { MailingService } from './mailing.service';
@Controller('mailing-annalistic-bot')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('send-message-to-users')
  async sendMessageToUsers(@Body() dto: SendMessageToUsersDto) {
    return await this.mailingService.sendMessageToUsers(dto);
  }
}
