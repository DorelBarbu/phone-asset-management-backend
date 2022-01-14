import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signIn(@Body() user: CreateUserDto) {
    return this.authService.signin(user.email, user.password);
  }
}
