import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { AuthenticatedUser } from './dtos/authenticated-user.dto';

const scrypt = promisify(_scrypt);

// We can also store the public and private key in an env variable.
// However, for development purposes, I will leave it here at the moment
const PRIVATE_KEY = readFileSync('./keys/rsa.key');
const EXPIRES_IN_SECONDS = 10 * 60;

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(userDto: CreateUserDto) {
    const { email, password } = userDto;

    console.log(await this.userService.find(email));
    if ((await this.userService.find(email)).length > 0) {
      throw new BadRequestException(
        'Email is already in use. Choose another username',
      );
    }

    const salt = randomBytes(8).toString('hex');
    const newUser = await this.userService.create(
      email,
      await AuthService.hashPassword(password, salt),
    );

    //TO-DO: use an interceptor to strip the password field
    newUser.password = '';

    return newUser;
  }

  async signin(username: string, password: string): Promise<AuthenticatedUser> {
    const [user] = await this.userService.find(username);
    if (!user) {
      throw new BadRequestException(
        'No user found with the given email address',
      );
    }

    const salt = AuthService.getSaltFromHashPassword(user.password);

    if ((await AuthService.hashPassword(password, salt)) !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({}, PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: EXPIRES_IN_SECONDS,
      subject: user.id.toString(),
    });

    return {
      expiresAt: Math.floor(+new Date() / 1000) + EXPIRES_IN_SECONDS,
      token,
      username,
    };
  }

  private static async hashPassword(plainTextPassword: string, salt: string) {
    const hash = (await scrypt(plainTextPassword, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;

    return hashedPassword;
  }

  private static getSaltFromHashPassword(hashPassword: string) {
    return hashPassword.split('.')[0];
  }
}
