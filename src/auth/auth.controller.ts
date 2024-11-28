import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { LocalAuthGuard } from './guards/local-auth.guard'

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(){}
}


