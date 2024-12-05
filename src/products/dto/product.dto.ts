import { IsNumber, IsString } from 'class-validator'

export class ProductDto {
  @IsString()
  id: string

  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  price: number
}
