import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception);

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let code: string | undefined = undefined;
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object') {
        message =
          (res as any).message ||
          (res as any).error ||
          message;
      }
    }  else if (exception?.driverError?.detail) {
      message = exception.driverError.detail;

      const err = exception.driverError;
      status = HttpStatus.BAD_REQUEST;

      code = err.code;
      details = {
        error_code: code,
        table: err.table,
        constraint: err.constraint,
      };
    }

    response.status(status).json({
      status: 'error',
      error: {
        code: status,
        message,
        details
      },
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
