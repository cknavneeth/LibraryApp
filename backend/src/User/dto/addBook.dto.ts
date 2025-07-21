import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length, Max, Min, min } from "class-validator";

export class addBookDto{

    @IsNotEmpty()
    @IsString()
    @Length(3)
    title:string

    @IsNotEmpty()
    @IsString()
    @Length(3)
    author:string


    @IsNotEmpty()
    @IsString()
    @Length(3)
    publisher:string

    @IsNotEmpty()
    @Type(()=>Number)
    @IsNumber()
    @Min(1000)
     @Max(4000)
    publicationYear:number

    @IsNotEmpty()
    @IsString()
    @Length(3)
    edition:string

    @IsNotEmpty()
    @IsString()
    @Length(3)
    language:string

    @IsNotEmpty()
    @IsString()
    @Length(3)
    genre:string

    @IsNotEmpty()
    @IsString()
    @Length(3)
    description:string

    @IsNotEmpty()
    @Type(()=>Number)
    @IsNumber()
    totalCopies:number

    @IsNotEmpty()
    @Type(()=>Number)
    @IsNumber()
    availableCopies:number
}
  