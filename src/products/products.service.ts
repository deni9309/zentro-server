import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(productData: CreateProductDto, userId: string) {
    return this.prismaService.product.create({
      data: {
        ...productData,
        price: Number(productData.price),
        userId,
      },
    })
  }

  async getProducts() {
    return this.prismaService.product.findMany()
  }
}
