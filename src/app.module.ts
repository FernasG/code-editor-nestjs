import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from '@authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CodespacesModule } from './codespaces/codespaces.module';
import config from './configuration/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: ((configService: ConfigService) => configService.get('database'))
    }),
    AuthenticationModule,
    UsersModule,
    CodespacesModule
  ]
})
export class AppModule { }
