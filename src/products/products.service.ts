import { Injectable } from '@nestjs/common'
import { promises as fs } from 'fs'

import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { join } from 'path'

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

  uploadProductImage(productId: string, file: Buffer) {
    console.log('productId', productId)
    console.log('file', file)
  }

  async getProducts() {
    const products = await this.prismaService.product.findMany()

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    )
  }

  private async imageExists(productId: string) {
    try {
      await fs.access(
        join(__dirname, '../../', `public/products/${productId}.jpg`),
        fs.constants.F_OK,
      )

      return true
    } catch (_) {
      return false
    }
  }
}
