import { IsEmail, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
  @IsEmail()    
  email: string
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minLength: 8,
    minSymbols: 1,
  })
  password: string
}
