import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { MailingBotUserEntity } from './entity/mailing-bot-user.entity';

@Injectable()
export class SellersHubMailingBotUserService {
  private readonly logger = new Logger(SellersHubMailingBotUserService.name);
  constructor(
    @InjectRepository(MailingBotUserEntity)
    private readonly mailingBotUserRepository: Repository<MailingBotUserEntity>,
  ) {}

  async createUser(data: DeepPartial<MailingBotUserEntity>) {
    try {
      const user = this.mailingBotUserRepository.create(data);
      return await this.mailingBotUserRepository.save(user);
    } catch (error) {
      this.logger.error(`Error from ${this.createUser.name}`, error.message);
    }
  }

  async findUser(options: FindOneOptions<MailingBotUserEntity>) {
    try {
      return await this.mailingBotUserRepository.findOne(options);
    } catch (error) {
      this.logger.error(`Error from ${this.findUser.name}`, error.message);
    }
  }
}
