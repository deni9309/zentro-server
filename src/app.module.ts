import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'

import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ProductsModule } from './products/products.module'
import { CheckoutModule } from './checkout/checkout.module'
import { HealthController } from './health.controller'

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductsModule,
    CheckoutModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
