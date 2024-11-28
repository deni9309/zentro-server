import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { NoFilesInterceptor } from '@nestjs/platform-express'

@ApiTags('users')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user)
  }
}
