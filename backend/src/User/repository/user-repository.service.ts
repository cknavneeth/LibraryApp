import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IRegisterRepository } from '../interface/repository/repository.interface';
import { registerDto } from '../dto/register.dto';
import { User, userDocument } from '../schema/user.schema';
import { create } from 'domain';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGE } from 'src/Messages/message.constant';
import { loginDto } from '../dto/login.dto';
import { addBookDto } from '../dto/addBook.dto';
import { Book, BookDocument, } from '../schema/book.schema';
import { editBookDto } from '../dto/editBook.dto';
import { paginationDto } from '../dto/pagination.dto';
import { PaginatedBooksResponse, usersForAdmin } from 'src/Responses/response.interface';
import { ResourceLimits } from 'worker_threads';

@Injectable()
export class UserRepositoryService implements IRegisterRepository{

    constructor(
        @InjectModel(User.name) private _userModel:Model<userDocument>,
        @InjectModel(Book.name) private _bookModel:Model<BookDocument>
    ){}

    async createUser(registerDto: registerDto,hashedPassword:string): Promise<userDocument | null> {
        try {
            let newUser=new this._userModel({
                name:registerDto.name,
                emailAddress:registerDto.emailAddress,
                password:hashedPassword,
                role:registerDto.role
            })
            return await newUser.save()
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async findByEmail(emailAddress: string): Promise<userDocument | null> {
        const user=await this._userModel.findOne({emailAddress:emailAddress})
        if(!user){
            throw new NotFoundException(MESSAGE.USER.NOT_FOUND)
        }
        return user
    }

    async findById(userId: string): Promise<userDocument> {
        const user=await this._userModel.findById(userId)
        if(!user){
            throw new NotFoundException(MESSAGE.USER.NOT_FOUND)
        }
        return user
    }


    async addBook(addBookDto: addBookDto, coverUrl: any, pdfUrl: any, adminId:string): Promise<BookDocument> {
        try {
            let admin=new Types.ObjectId(adminId)
            const newBook=await this._bookModel.create({
                admin,
                 ...addBookDto,
                 coverUrl,
                 pdfUrl
            })

            return await newBook.save()
        } catch (error) {
             if(error instanceof HttpException){
                throw error
             }
             throw new InternalServerErrorException(error.message)
        }
    }

    async findBybookId(bookId: string): Promise<BookDocument> {
        try {
            const book=await this._bookModel.findById(bookId)
            if(!book){
                throw new NotFoundException(MESSAGE.BOOK.NOT_FOUND)
            }
            return book
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


    async updateBook(editBookDto: editBookDto, coverUrl: any, pdfUrl: any, adminId:string,bookId:string): Promise<BookDocument> {
        try {
            let admin=new Types.ObjectId(adminId)
            let book=new Types.ObjectId(bookId)
            
            const updatedBook=await this._bookModel.findByIdAndUpdate(book,{
                ...editBookDto,
                coverUrl,
                pdfUrl
            },{new:true,runValidators:true})

            if(!updatedBook){
                throw new NotFoundException(MESSAGE.BOOK.NOT_FOUND)
            }

            return updatedBook
        } catch (error) {
            console.error('error in the update book',error)
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


    async getAdminBooks(adminId: string): Promise<BookDocument[]> {
        try {
            let admin=new Types.ObjectId(adminId)
            const books=await this._bookModel.aggregate([{$match:{admin:new Types.ObjectId(admin)}}])
            if(!books){
                throw new NotFoundException(MESSAGE.BOOK.NOT_FOUND)
            }
            return books
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async findAllBooks(pagination:paginationDto): Promise<PaginatedBooksResponse> {
        try {
            let {page=1,limit=10}=pagination
            let skip=(page-1)*limit
            const [books,total]=await Promise.all([
                 this._bookModel.find()
                .skip(skip)
                .limit(10)
                .lean()
                .exec(),
                 this._bookModel.countDocuments()
            ])

           const plainBooks=books.map((book)=>({
            ...book,
            _id:book._id.toString()
           }))
            

            return {
                books:plainBooks,
                page,
                limit,
                totalPages:Math.ceil(total/limit),
                totalBooks:total

            }
        } catch (error) {
            if (error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


    async addBorrowedBook(userId: string, BookId:Types.ObjectId ): Promise<userDocument> {
        try {
            const user=new Types.ObjectId(userId)
            const updatedBorrow=await this._userModel.findByIdAndUpdate(user,{
                $addToSet:{borrowedBooks:BookId},
                
            },{new : true})
            if(!updatedBorrow){
                throw new NotFoundException('updating borrow failed')
            }
            return updatedBorrow
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


    async returnBook(userId: string, BookId: Types.ObjectId): Promise<userDocument> {
        try {
            const user=new Types.ObjectId(userId)
            const returnBook=await this._userModel.findByIdAndUpdate(user,{
                $pull:{borrowedBooks:BookId}
            })
            if(!returnBook){
                throw new NotFoundException('user is not found for return')
            }
            return returnBook
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async borrowedBooks(userId: string): Promise<userDocument> {
        try {
            const borrowedBooks=await this._userModel.findById(userId).populate('borrowedBooks')
            if(!borrowedBooks){
                throw new NotFoundException('NO books found for user')
            }
            return borrowedBooks
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


    async findAllUsers(paginationDto: paginationDto): Promise<{
        users:any[],
        page:number,
        totalPage:number,
        total:number
    }> {
        try {
            const {page=1,limit=10}=paginationDto
            const skip=(page-1)*limit

            const [users,total]=await Promise.all([
                await this._userModel.find()
                .skip(skip)
                .limit(limit)
                .populate('borrowedBooks')
                .lean()
                .exec(),
                await this._userModel.countDocuments()
            ])

            const plainUsers=users.map(user=>({
                ...user,
                _id:user._id.toString()
            }))


            return {
                users:plainUsers,
                page:page,
                totalPage:Math.ceil(total/limit),
                total
            }
        } catch (error) {
             if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async countBooks(): Promise<number> {
        return this._bookModel.countDocuments()
    }

    
}
