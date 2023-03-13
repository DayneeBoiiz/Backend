import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  NickName: string;

  @IsString()
  @IsNotEmpty()
  LastName: string;

  @IsString()
  @IsNotEmpty()
  FirstName: string;
}

export class AuthDtoLogin {
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
