import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { LocalStrategy } from './strategies/local-strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import {
  JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_ACCESS_TOKEN_SECRET,
} from './constants'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cnf: ConfigService) => ({
        secret: cnf.getOrThrow(JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: cnf.getOrThrow(JWT_ACCESS_TOKEN_EXPIRATION),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
