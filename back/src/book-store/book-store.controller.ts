import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookStoreService } from './book-store.service';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { UpdateBookStoreDto } from './dto/update-book-store.dto';

@Controller('book-store')
export class BookStoreController {
  constructor(private readonly bookStoreService: BookStoreService) {}

  @Post()
  create(@Body() createBookStoreDto: CreateBookStoreDto) {
    return this.bookStoreService.create(createBookStoreDto);
  }

  @Get()
  findAll() {
    return this.bookStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookStoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookStoreDto: UpdateBookStoreDto) {
    return this.bookStoreService.update(+id, updateBookStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookStoreService.remove(+id);
  }
}
