import { Controller, Get, Request, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { User } from 'src/users/user.entity';
import { PhonesService } from './phones.service';

@Controller('phones')
@UseInterceptors(CurrentUserInterceptor)
export class PhonesController {
  constructor(private phonesService: PhonesService) {}

  @Get('') getAllPhones(@CurrentUser() currentUser: User) {
    return this.phonesService.find();
  }
}
