import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { UsersModule } from './users/users.module'

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cnf: ConfigService) => {
        const isProd = cnf.get('NODE_ENV') === 'production'
        return {
          pinoHttp: {
            transport: isProd
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: { singleLine: true, colorize: true },
                },
            level: isProd ? 'info' : 'debug',
          },
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
