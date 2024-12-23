import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

import { ProductsService } from './products.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import { TokenPayload } from '../auth/token-payload.interface'
import { ProductDto } from './dto/product.dto'
import { PRODUCT_IMAGES } from './product-images'

@ApiTags('products')
@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({ description: 'Product created.' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data provided.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() product: CreateProductDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(product, user.userId)
  }

  /**
   * Uploads a product image.
   *
   * The image must be a JPEG under 500KB in size.
   * The image is saved to the `public/products` directory, with the filename
   * being the product ID with the correct extension.
   *
   * @param file The image to upload.
   * @param productId The ID of the product to associate the image with.
   * @returns The ID of the product.
   */
  @Post(':productId/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: PRODUCT_IMAGES,
        filename: (req, file, callback) => {
          callback(null, `${req.params.productId}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('productId') productId: string,
  ) {
    return this.productsService.uploadProductImage(productId, file.buffer)
  }

  @Get()
  @ApiOkResponse({ type: ProductDto, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred while getting products',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getProducts(@Query('status') status?: string) {
    return this.productsService.getProducts(status)
  }

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ProductDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(productId)
  }
}
