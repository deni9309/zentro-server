import { IsBoolean, IsNumber, IsDate, IsString } from 'class-validator'

export class ProductDto {
  @IsString()
  id: string

  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  price: number

  @IsString()
  userId: string

  @IsDate()
  createdAt: Date

  @IsBoolean()
  imageExists: boolean
}
