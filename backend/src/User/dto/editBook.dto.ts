import { PartialType } from "@nestjs/mapped-types";
import { addBookDto } from "./addBook.dto";

export class editBookDto extends PartialType(addBookDto){

}