import { LoginResponse, PaginatedBooksResponse, paginatedUserResponse } from "src/Responses/response.interface";
import { addBookDto } from "src/User/dto/addBook.dto";
import { editBookDto } from "src/User/dto/editBook.dto";
import { loginDto } from "src/User/dto/login.dto";
import { paginationDto } from "src/User/dto/pagination.dto";
import { registerDto } from "src/User/dto/register.dto";
import { BookDocument } from "src/User/schema/book.schema";
import { userDocument } from "src/User/schema/user.schema";

export interface IRegisterService{
    registerUser(registerDto:registerDto):Promise<userDocument|null>
    loginUser(loginDto:loginDto):Promise<{accessToken:string,refreshToken:string,role:string}>
    refreshAccessToken(refreshToken:string):Promise<string>
    addBooks(addBookDto:addBookDto,cover:any,pdf:any,adminId:string):Promise<BookDocument>
    editBooks(editBookDto:editBookDto,cover:any,pdf:any,adminId:string,bookId:string):Promise<BookDocument>
    getAdminBooks(adminId:string):Promise<BookDocument[]>
    getuserbooks(pagination:paginationDto):Promise<PaginatedBooksResponse>
    findBook(bookid:string):Promise<BookDocument>
    borrowBook(bookId:string,userId:string):Promise<userDocument>
    returnBook(bookId:string,userId:string):Promise<userDocument>
    borrowedBooks(userId:string):Promise<userDocument>
    fetchAllUsers(paginationDto:paginationDto):Promise<paginatedUserResponse>
}