import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(Logger))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Zentro')
    .setDescription('Zentro API | Documentation')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  await app.listen(app.get(ConfigService).getOrThrow('PORT')) //await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
