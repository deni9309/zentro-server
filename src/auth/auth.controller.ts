import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
// import { User } from '@prisma/client'
import { Response } from 'express'

import { LocalAuthGuard } from './guards/local-auth.guard'
// import { CurrentUser } from './current-user.decorator'
import { AuthService } from './auth.service'
import { LoginUserDto } from '../users/dto/login-user.dto'

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Logs the user in. Attaches a \"Authentication\" cookie to the response." })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Body() user: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response)
  }
}
