import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { promises as fs } from 'fs'

import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { join } from 'path'
import { PRODUCT_IMAGES } from './product-images'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(productData: CreateProductDto, userId: string) {
    try {
      return this.prismaService.product.create({
        data: {
          ...productData,
          price: Number(productData.price),
          userId,
        },
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new UnprocessableEntityException('Invalid data provided.')
      }

      console.error('Error creating product', err)
      throw new InternalServerErrorException('Error creating product')
    }
  }

  uploadProductImage(productId: string, file: Buffer) {
    console.log('productId', productId)
    console.log('file', file)
  }

  async getProducts(status?: string) {
    try {
      const args: Prisma.ProductFindManyArgs = {}
      if (status && status === 'available') {
        args.where = { sold: false }
      }

      const products = await this.prismaService.product.findMany(args)

      return Promise.all(
        products.map(async (product) => ({
          ...product,
          imageExists: await this.imageExists(product.id),
        })),
      )
    } catch (error) {
      console.error('Error getting products', error)
      throw new InternalServerErrorException('Error getting products')
    }
  }

  async getProduct(productId: string) {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: { id: productId },
        })),
        imageExists: await this.imageExists(productId),
      }
    } catch (err) {
      console.error('Error getting product', err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(`Product with ID ${productId} not found.`)
      } else {
        throw new InternalServerErrorException('Error getting product')
      }
    }
  }

  async updateProduct(productId: string, product: Prisma.ProductUpdateInput) {
    try {
      await this.prismaService.product.update({
        where: { id: productId },
        data: product,
      })
    } catch (error) {
      throw error
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
