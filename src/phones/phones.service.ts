import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from './phone.entity';


@Injectable()
export class PhonesService {
  constructor(@InjectRepository(Phone) private repo: Repository<Phone>) {}

  find() {
    return this.repo.find();
  }
}
