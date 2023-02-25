import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './http-exception-response.interface';

import { winstonLogger, initWinston } from './winston.logger';

initWinston('AllExceptionsFilter', 'Initiating AllExceptionsFilter...');

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    winstonLogger.error(
      JSON.stringify(exception),
      'AllExceptionsFilter before if statement',
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: HttpStatus;
    let errorMessage: string;
    let errorDescription: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
      errorDescription =
        (errorResponse as HttpExceptionResponse).message ||
        'Something went wrong!';
    } else {
      winstonLogger.error(
        JSON.stringify(exception),
        'AllExceptionsFilter during else statement',
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage =
        exception.toString() || 'Critical internal server error occurred!';
    }

    const errorResponse = this.getErrorResponse(
      status,
      errorMessage,
      errorDescription,
      request,
    );
    const errorLog = this.getErrorLog(errorResponse, request, exception);
    winstonLogger?.error(errorLog);
    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    errorDescription: string,
    request: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    message: errorDescription,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    request: Request | any,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
    ${JSON.stringify(errorResponse)}\n\n
    User: ${JSON.stringify(request?.currentPartner ?? 'Not signed in')}\n\n
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;
    return errorLog;
  };
}
