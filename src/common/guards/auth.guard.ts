import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.session.userId) {
      throw new HttpException(
        'You are not authenticated yet. Please login first.',
        HttpStatus.FORBIDDEN,
      );
    } else {
      return true;
    }
  }
}
