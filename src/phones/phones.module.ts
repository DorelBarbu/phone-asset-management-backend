import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Phone } from './phone.entity';
import { PhonesController } from './phones.controller';
import { PhonesService } from './phones.service';

@Module({
  controllers: [PhonesController],
  imports: [UsersModule, TypeOrmModule.forFeature([Phone])],
  providers: [PhonesService],
})
export class PhonesModule {}
