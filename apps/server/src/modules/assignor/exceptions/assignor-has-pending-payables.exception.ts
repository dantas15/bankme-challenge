import { HttpException, HttpStatus } from '@nestjs/common';

export class AssignorHasPendingPayablesException extends HttpException {
  constructor() {
    super('Assignor has pending payables', HttpStatus.BAD_REQUEST);
  }
}
