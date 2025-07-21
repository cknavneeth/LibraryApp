import { IsNotEmpty, IsString, Length, maxLength, MinLength,MaxLength, Matches } from "class-validator";

export class registerDto{

    @IsString()
    @IsNotEmpty()
    @Length(3)
    name:string

    @IsString()
    @IsNotEmpty()
    emailAddress:string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(11)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password:string


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(11)
    confirmPassword:string

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    role:string
}