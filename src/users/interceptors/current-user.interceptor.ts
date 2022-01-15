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

  private getTokenFromAuthorizationHeader(authHeader: string) {
    const parts = authHeader?.split(" ");

    if (!parts) {
      return null;
    }

    if(parts.length == 2) {
      return parts[1];
    }

    return parts[0];
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const httpRequest = context.switchToHttp().getRequest();
    const authorizationHeader = httpRequest.headers.authorization as string;
    const bearer = this.getTokenFromAuthorizationHeader(authorizationHeader);
    

    // TO-DO: Move this to a Guard
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
