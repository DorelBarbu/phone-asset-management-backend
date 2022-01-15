import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { CreatePhoneDto } from './dtos/create-phone.dto';
import { Phone } from './phone.entity';
import { PhonesService } from './phones.service';

@Controller('phones')
@UseInterceptors(CurrentUserInterceptor)
export class PhonesController {
  constructor(private phonesService: PhonesService) {}

  @Get('') getAllPhones() {
    return this.phonesService.find();
  }

  @Post('') createPhone(@Body() phoneDto: CreatePhoneDto) {
    return this.phonesService.create(phoneDto);
  }

  @Patch('/:id') updatePhone(
    @Param('id') id: string,
    @Body() phoneDto: Partial<Phone>,
  ) {
    return this.phonesService.update(parseInt(id), phoneDto);
  }
}
