import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<{ id: string; email: string }> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
        select: {
          id: true,
          email: true,
        },
      })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException('Email already in use.')
      }
      throw error
    }
  }
}
