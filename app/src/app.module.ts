import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TelegrafModule } from 'nestjs-telegraf';
import { CommandModule } from './command/command.module';
import * as LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

enum Stage {
  production = 'production',
  development = 'development',
}

@Module({
  imports: [
    CommandModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('TOKEN'),
        middlewares: [
          new LocalSession({
            database: 'session.json',
          }),
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        port: configService.get('POSTGRES_PORT'),
        host: configService.get('POSTGRES_HOST'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TOKEN: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === Stage.production
          ? '../envs/.production.env'
          : '../envs/.development.env',
    }),
    UserModule,
  ],
})
export class AppModule {}
