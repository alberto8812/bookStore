import { IsEmail, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    }
    )
    password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;
}
