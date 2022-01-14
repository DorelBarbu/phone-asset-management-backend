import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { PhonesModule } from './phones/phones.module';
import { Phone } from './phones/phone.entity';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Phone],
      synchronize: true,
    }),
    PhonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
