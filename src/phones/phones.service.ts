import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhoneDto } from './dtos/create-phone.dto';
import { Phone } from './phone.entity';

@Injectable()
export class PhonesService {
  constructor(@InjectRepository(Phone) private repo: Repository<Phone>) {}

  find() {
    return this.repo.find();
  }

  create(phoneDto: CreatePhoneDto) {
    const phone = this.repo.create(phoneDto);

    return this.repo.save(phone);
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  async update(id: number, attrs: Partial<Phone>) {
    const phone = await this.findOne(id);
    if (!phone) {
      throw new NotFoundException('Phone not found');
    }
    return this.repo.save({
      ...phone,
      ...attrs,
    });
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
