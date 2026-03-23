import { IsEnum, IsString } from "class-validator";
import { StatusBook } from "src/book-store/domain/model/book.model";

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookStoreDto {

    @ApiProperty({ example: 'The Great Gatsby', description: 'title of the book' })
    @IsString(
        { message: 'The title must be a string' }
    )
    title: string;
    @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'author of the book' })
    @IsString(
        { message: 'The author must be a string' }
    )
    autor: string;
    @ApiProperty({ example: 19.99, description: 'price of the book' })
    @IsString(
        { message: 'The price must be a string' }
    )
    price: number;
    @ApiProperty({ example: 'A classic novel set in the 1920s...', description: 'description of the book' })
    @IsString(
        { message: 'The description must be a string' }
    )
    description: string;

    @ApiProperty({ example: 'available', description: 'status of the book' })
    @IsEnum(StatusBook, { message: 'The status must be either "available" or "reserved"' })
    status: StatusBook;

}
