import { Injectable, NotFoundException } from '@nestjs/common'
import { promises as fs } from 'fs'

import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { join } from 'path'
import { PRODUCT_IMAGES } from './product-images'

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
    const products = (await this.prismaService.product.findMany())

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    )
  }

  async getProduct(productId: string) {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: { id: productId },
        })),
        imageExists: await this.imageExists(productId),
      }
    } catch (_) {
      throw new NotFoundException(`Product with ID ${productId} not found.`)
    }
  }

  private async imageExists(productId: string) {
    try {
      await fs.access(
        join(`${PRODUCT_IMAGES}/${productId}.jpg`),
        fs.constants.F_OK,
      )

      return true
    } catch (_) {
      return false
    }
  }
}
