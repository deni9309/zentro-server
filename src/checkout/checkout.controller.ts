import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateSessionDto } from './dto/create-session.dto'
import { CheckoutService } from './checkout.service'

@Controller('api/checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @ApiCreatedResponse({ description: 'Stripe checkout session created' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Error creating Stripe checkout session' })
  @UseGuards(JwtAuthGuard)
  async createSession(@Body() request: CreateSessionDto) {
    return this.checkoutService.createSession(request.productId)
  }
}
