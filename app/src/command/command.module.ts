import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CommandUpdate } from './command.update';

@Module({
  imports: [UserModule],
  providers: [CommandUpdate],
})
export class CommandModule {}
