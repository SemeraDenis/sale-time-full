import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
