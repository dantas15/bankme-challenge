import { IsNotEmpty, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class CreatePayableDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsDateString()
  emissionDate: Date;

  @IsNotEmpty()
  @IsUUID()
  assignorId: string;
}
