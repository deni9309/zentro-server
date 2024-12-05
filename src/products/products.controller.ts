import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ProductsService } from './products.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import { TokenPayload } from '../auth/token-payload.interface'
import { ProductDto } from './dto/product.dto'

@ApiTags('products')
@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({ description: 'Product created.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() product: CreateProductDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(product, user.userId)
  }

  @Get()
  @ApiOkResponse({ type: ProductDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    return this.productsService.getProducts()
  }
}
