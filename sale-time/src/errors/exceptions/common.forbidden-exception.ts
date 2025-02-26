import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonForbiddenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
