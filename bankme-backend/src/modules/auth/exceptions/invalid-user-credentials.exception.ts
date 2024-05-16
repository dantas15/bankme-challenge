import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserCredentialsException extends HttpException {
  constructor() {
    super('Invalid username or password', HttpStatus.BAD_REQUEST);
  }
}
