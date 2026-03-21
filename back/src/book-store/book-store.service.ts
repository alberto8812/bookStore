import { Injectable } from '@nestjs/common';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { UpdateBookStoreDto } from './dto/update-book-store.dto';

@Injectable()
export class BookStoreService {
  create(createBookStoreDto: CreateBookStoreDto) {
    return 'This action adds a new bookStore';
  }

  findAll() {
    return `This action returns all bookStore`;
  }

  findOne(id: number) {
    return `hola mundo 2.2 mundo `;
  }

  update(id: number, updateBookStoreDto: UpdateBookStoreDto) {
    return `This action updates a #${id} bookStore`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookStore`;
  }
}
