import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ProductsService } from '../products/products.service'
import Stripe from 'stripe'

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
        metadata: { productId },
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

  async handleCheckoutWebhook(event: any) {
    if (event.type !== 'checkout.session.completed') return

    try {
      const session = await this.stripe.checkout.sessions.retrieve(
        event.data.object.id,
      )

      await this.productService.updateProduct(session.metadata.productId, {
        sold: true,
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Product not found')
      } else {
        throw new InternalServerErrorException(
          "Error updating product's sold status",
        )
      }
    }
  }
}
