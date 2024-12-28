import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Response } from 'express'

import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { LoginUserDto } from '../users/dto/login-user.dto'

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary:
      'Logs the user in - attaches an "Authentication" cookie to the response headers.',
  })
  @ApiUnauthorizedResponse({ description: 'Credentials are not valid.' })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Body() user: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response)
  }
}
