import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string

  @IsString()
  @MinLength(3)
  @MaxLength(600)
  description: string

  @IsNumber()
  price: number
}