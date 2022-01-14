import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { UsersService } from '../users.service';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';

const PUBLIC_KEY = readFileSync('./keys/rsa.key.pub');

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const httpRequest = context.switchToHttp().getRequest();
    const authorizationHeader = httpRequest.headers.authorization as string;
    const bearer = authorizationHeader?.split(' ')['1'];

    if (!authorizationHeader || !bearer) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    try {
      const tokenVerified = jwt.verify(bearer, PUBLIC_KEY);
      const userId = tokenVerified.sub;
      const currentUser = await this.userService.findOne(userId);
      httpRequest.currentUser = currentUser;
    } catch (e) {
      throw new UnauthorizedException(
        'Your session expired. Log in again in order to use the application',
      );
    }

    return next.handle();
  }
}
