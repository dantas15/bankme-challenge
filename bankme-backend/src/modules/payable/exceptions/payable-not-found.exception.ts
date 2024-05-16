import { HttpException, HttpStatus } from '@nestjs/common';

export class PayableNotFoundException extends HttpException {
  constructor(payableId?: string) {
    super(`Payable not found with id: ${payableId}`, HttpStatus.NOT_FOUND);
  }
}
