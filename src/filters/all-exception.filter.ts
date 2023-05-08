import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * @description Exception json response
     * @param message
     */
    const responseMessage = (type: string, message: string) => {
      response.status(status).json({
        status,
        type,
        message,
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if (typeof exception.message === 'string') {
      responseMessage(exception.name, exception.message);
    }
  }
}
