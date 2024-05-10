import {
  IsNotEmpty,
  IsString,
  Matches,
  IsEmail,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateAssignorDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{11}$|^[0-9]{14}$/, {
    // this validation length is because
    // brazillian documents can only be CPF (11 digits) or CNPJ (14 digits)
    message: 'Document must be either 11 or 14 characters long',
  })
  document: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(140)
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  @MaxLength(20)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(140)
  name: string;
}
