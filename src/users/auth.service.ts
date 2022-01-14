import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

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

    const newUser = await this.userService.create(
      email,
      await AuthService.hashPassword(password),
    );

    //TO-DO: use an interceptor to strip the password field
    newUser.password = '';

    return newUser;
  }

  private static async hashPassword(plainTextPassword) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(plainTextPassword, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;

    return hashedPassword;
  }
}
