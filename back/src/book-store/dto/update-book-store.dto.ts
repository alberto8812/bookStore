import { PartialType } from '@nestjs/mapped-types';
import { CreateBookStoreDto } from './create-book-store.dto';

export class UpdateBookStoreDto extends PartialType(CreateBookStoreDto) {}
