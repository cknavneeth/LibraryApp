import { Types } from "mongoose";
import { PaginatedBooksResponse, paginatedUserResponse } from "src/Responses/response.interface";
import { addBookDto } from "src/User/dto/addBook.dto";
import { editBookDto } from "src/User/dto/editBook.dto";
import { loginDto } from "src/User/dto/login.dto";
import { paginationDto } from "src/User/dto/pagination.dto";
import { registerDto } from "src/User/dto/register.dto";
import { Book, BookDocument } from "src/User/schema/book.schema";
import { userDocument } from "src/User/schema/user.schema";

export interface IRegisterRepository{
    createUser(registerDto:registerDto,hashedPassword:string):Promise<userDocument|null>
    // loginUser(loginDto:loginDto):Promise<userDocument|null>
    findByEmail(emailAddress:string):Promise<userDocument|null>
    findById(userId:string):Promise<userDocument>
    addBook(addBookDto:addBookDto,coverUrl:any,pdfUrl:any,adminId:string):Promise<BookDocument>
    findBybookId(bookId:string):Promise<BookDocument>
    updateBook(editBookDto:editBookDto,coverUrl:any,pdfUrl:any,adminId:string,bookId:string):Promise<BookDocument>
    getAdminBooks(adminId:string):Promise<BookDocument[]>
    findAllBooks(pagination:paginationDto):Promise<PaginatedBooksResponse>
    addBorrowedBook(userId:string,BookId:Types.ObjectId):Promise<userDocument>
    returnBook(userId:string,BookId:Types.ObjectId):Promise<userDocument>
    borrowedBooks(userId:string):Promise<userDocument>
    findAllUsers(paginationDto:paginationDto):Promise<paginatedUserResponse>
    countBooks():Promise<number>
}