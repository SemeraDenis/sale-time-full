import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CommonConflictException } from '../exceptions/common.conflict-exception';

@Catch()
@Injectable()
export class CustomExceptionHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorCode = this.getErrorCode(exception, status);
    const errorMessage = exception.message || 'Internal server error';

    const errorResponse: { code: string; message: string } = {
      code: errorCode,
      message: errorMessage,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(exception: any, status: number): string {
    if (exception instanceof CommonConflictException)
      return HttpStatus.CONFLICT.toString();

    return status === HttpStatus.INTERNAL_SERVER_ERROR
      ? HttpStatus.INTERNAL_SERVER_ERROR.toString()
      : HttpStatus.BAD_REQUEST.toString();
  }
}
