import { IsEnum, IsString } from "class-validator";
import { StatusBook } from "src/book-store/domain/model/book.model";



export class CreateBookStoreDto {

    @IsString(
        { message: 'The title must be a string' }
    )
    title: string;
    @IsString(
        { message: 'The author must be a string' }
    )
    autor: string;
    @IsString(
        { message: 'The price must be a string' }
    )
    price: number;
    @IsString(
        { message: 'The description must be a string' }
    )
    description: string;

    @IsEnum(StatusBook, { message: 'The status must be either "available" or "reserved"' })
    status: StatusBook;

}
