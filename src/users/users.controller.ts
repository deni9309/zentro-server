import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { NoFilesInterceptor } from '@nestjs/platform-express'

import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { TokenPayload } from '../auth/token-payload.interface'

@ApiTags('users')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Creates a new user and saves it in the DB.' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnprocessableEntityResponse({ description: 'Email already in use.' })
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user)
  }

  @ApiOperation({ summary: "Returns the current user's information." })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: TokenPayload) {
    return user
  }
}
