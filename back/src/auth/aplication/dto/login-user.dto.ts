import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class LoginUserDto {
    @ApiProperty({ example: 'ceve@gamil.com', description: 'email of user' })
    @IsEmail()
    email: string;
    @ApiProperty({ example: 'Password123', description: 'password of user', maxLength: 50, minLength: 6 })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'The password must have a Uppercase, lowercase letter and a number',
    })
    password: string;

}