import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(140)
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
