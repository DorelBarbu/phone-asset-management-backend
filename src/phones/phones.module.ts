import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PhonesController } from './phones.controller';

@Module({
  controllers: [PhonesController],
  imports: [UsersModule],
})
export class PhonesModule {}
