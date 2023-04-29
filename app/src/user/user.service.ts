import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: Omit<UserEntity, 'id' | 'createdAt'>) {
    try {
      const user = this.userRepository.create({ ...dto });
      return await this.userRepository.save(user);
    } catch (e) {
      this.logger.error('Error from create', e.message);
    }
  }

  async findOne(telegram_id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { telegram_id },
      });
      return user;
    } catch (e) {
      this.logger.error('Error from findOne', e.message);
    }
  }

  async update(telegram_id: string, order: string) {
    try {
      return await this.userRepository.update({ telegram_id }, { order });
    } catch (e) {
      this.logger.error('Error from update', e.message);
    }
  }
}
