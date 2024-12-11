import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

import { ProductsService } from '../products/products.service'

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(productId: string) {
    try {
      const product = await this.productService.getProduct(productId)

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: product.price * 100,
              product_data: {
                name: product.name,
                description: product.description,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
      })

      return session
    } catch (err: unknown) {
      if (err instanceof NotFoundException) {
        throw err
      } else {
        throw new BadRequestException('Error creating Stripe checkout session')
      }
    }
  }
}
