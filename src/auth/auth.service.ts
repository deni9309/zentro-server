import { Injectable, UnauthorizedException } from '@nestjs/common'
import ms from 'ms'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'
// import { User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from '../users/users.service'
import { TokenPayload } from './token-payload.interface'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { JWT_ACCESS_TOKEN_EXPIRATION } from './constants'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: LoginUserDto, response: Response) {
    try {
      const dbUser = await this.usersService.getUser({ email: user.email })

      const authenticated = await bcrypt.compare(user.password, dbUser.password)
      if (!authenticated) {
        throw new UnauthorizedException()
      }

      const expires = new Date()
      expires.setMilliseconds(
        expires.getMilliseconds() -
          expires.getTimezoneOffset() * 60 * 1000 +
          ms(
            this.configService.getOrThrow<string>(JWT_ACCESS_TOKEN_EXPIRATION),
          ),
      )

      const tokenPayload: TokenPayload = {
        userId: dbUser.id,
        email: dbUser.email,
      }

      const token = this.jwtService.sign(tokenPayload)

      response.cookie('Authentication', token, {
        secure: true,
        httpOnly: true,
        expires,
      })

      return { tokenPayload }
    } catch (err) {
      console.error('Error logging in', err)
      throw new UnauthorizedException('Credentials are not valid.')
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email })

      const authenticated = await bcrypt.compare(password, user.password)
      if (!authenticated) {
        throw new UnauthorizedException()
      }

      return user
    } catch (err) {
      console.error('Error verifying user', err)
      throw new UnauthorizedException('Credentials are not valid.')
    }
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verifyAsync(token)
    } catch (error) {
      throw error
    }
  }
}
