import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({description: "The user has been successfully created."})
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user)
  }
}
