import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class paginationDto{

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @Min(1)
    page?:number=1

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @Min(10)
    limit?:number=10

}