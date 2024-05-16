import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(140)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(140)
  password: string;
}
