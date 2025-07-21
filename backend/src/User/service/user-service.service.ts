import { BadRequestException, ConflictException, HttpException, Inject, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IRegisterService } from '../interface/service/service.interface';
import { registerDto } from '../dto/register.dto';
import { userDocument } from '../schema/user.schema';
import { MESSAGES } from '@nestjs/core/constants';
import { MESSAGE } from 'src/Messages/message.constant';
import { USER_REPOSITORY } from '../constants/user.constant';
import { UserRepositoryService } from '../repository/user-repository.service';
import { IRegisterRepository } from '../interface/repository/repository.interface';
import { LoginResponse, PaginatedBooksResponse, paginatedUserResponse } from 'src/Responses/response.interface';
import { loginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken'
import { addBookDto } from '../dto/addBook.dto';
import { BookDocument } from '../schema/book.schema';
import { CloudinaryService } from 'src/common/service/cloudinary/cloudinary.service';
import { editBookDto } from '../dto/editBook.dto';
import { paginationDto } from '../dto/pagination.dto';
import { Types } from 'mongoose';


@Injectable()
export class UserServiceService implements IRegisterService{

    private logger=new Logger(UserServiceService.name)

    constructor(
        @Inject(USER_REPOSITORY) private readonly _userRepository:IRegisterRepository,
        private _jwtService:JwtService,
        private configService:ConfigService,
        private _cloudinaryService:CloudinaryService
    ){}

    saltRounds:number=10


    generateAccess(user:userDocument){
        
            const payload={sub:user._id,emailAddress:user.emailAddress,role:user.role}
            this.logger.log('payloadingggg')
            const accessToken=this._jwtService.sign(payload,{secret:this.configService.get<string>('ACESS_TOKEN_SECRET'),expiresIn:this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')||'15m'}) 
            this.logger.log('accesspayload',payload)
            this.logger.log('accesstoken',accessToken)
            return accessToken
        
    }

    generateRefresh(user:userDocument){
        
            const payload={sub:user._id,emailAddress:user.emailAddress,role:user.role}
            const refreshToken=this._jwtService.sign(payload,{secret:this.configService.get<string>('REFRESH_TOKEN_SECRET'),expiresIn:this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')||'7d'})
             this.logger.log('accesspayload',payload)
            this.logger.log('accesstoken',refreshToken)
            return refreshToken
        
    }

    async registerUser(registerDto: registerDto): Promise<userDocument | null> {
        try {
            if(registerDto.password!==registerDto.confirmPassword){
                throw new BadRequestException(MESSAGE.USER.PASSWORD_NOT_MATCH)
            }

            let hashedPassword=await bcrypt.hash(registerDto.password,this.saltRounds)

            return this._userRepository.createUser(registerDto,hashedPassword)
        } catch (error) {
             if(error instanceof HttpException){
                throw error
             }
             throw new InternalServerErrorException(error.message)
        }
    }


    async loginUser(loginDto: loginDto): Promise<{accessToken:string,refreshToken:string,role:string}> {
        try {

            const user=await this._userRepository.findByEmail(loginDto.emailAddress!)

            if(!user){
                throw new NotFoundException(MESSAGE.USER.NOT_FOUND)
            }

            this.logger.log(loginDto)

            let isMatch=await bcrypt.compare(loginDto.password!,user.password)

            if(!isMatch){
                throw new BadRequestException(MESSAGE.USER.PASSWORD_NOT_MATCH)
            }


            


            let accessToken=this.generateAccess(user)
            let refreshToken=this.generateRefresh(user)
            let role=user.role

            this.logger.log('check')
            this.logger.log('check2',accessToken,refreshToken)

            return {accessToken,refreshToken,role}

        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


    async refreshAccessToken(refreshToken: string): Promise<string> {
        try {
            const verified=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET as string) as {sub:string}

            const user=await this._userRepository.findById(verified.sub)

            if(!user){
                throw new UnauthorizedException(MESSAGE.USER.NOT_FOUND)
            }

            const accessToken= this.generateAccess(user)

            return accessToken
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }

    }


    async addBooks(addBookDto: addBookDto, cover: any, pdf: any,adminId:string): Promise<BookDocument> {
        try {
             this.logger.log('Entered into addbook service')

             const count=await this._userRepository.countBooks()
             if(count>30){
                throw new BadRequestException('Already 50 book added.No more!')
             }

            const coverUrl=await this._cloudinaryService.uploadBuffer(
                cover.buffer,
                'book/cover',
                `${addBookDto.title}_cover`
            )

            const pdfUrl=await this._cloudinaryService.uploadBuffer(
                pdf.buffer,
                'book/pdf',
                `${addBookDto.title}_pdf`
            )

            this.logger.log('cloudinary completed yeah')

            return this._userRepository.addBook(addBookDto,coverUrl,pdfUrl,adminId)
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }



    async editBooks(editBookDto: editBookDto, cover: any, pdf: any, adminId: string , bookId:string): Promise<BookDocument> {
        try {
            const admin=await this._userRepository.findById(adminId)
            if(!admin){
                throw new NotFoundException(MESSAGE.USER.NOT_FOUND)
            }

            const book=await this._userRepository.findBybookId(bookId)

            if(!book){
                throw new NotFoundException(MESSAGE.BOOK.NOT_FOUND)
            }

            let coverUrl=book.coverUrl
            let pdfUrl=book.pdfUrl
 
        if(cover){
              coverUrl=await this._cloudinaryService.uploadBuffer(
                cover.buffer,
                'book/cover',
                `${editBookDto.title}_cover`
            )
        }

        if(pdf){
              pdfUrl=await this._cloudinaryService.uploadBuffer(
                pdf.buffer,
                'book/pdf',
                `${editBookDto.title}_pdf`
            )
        }
           


            return await this._userRepository.updateBook(editBookDto,coverUrl,pdfUrl,adminId,bookId)
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }




    async getAdminBooks(adminId: string): Promise<BookDocument[]> {
        try {
            return this._userRepository.getAdminBooks(adminId)
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getuserbooks(pagination:paginationDto): Promise<PaginatedBooksResponse> {
        try {
            return await this._userRepository.findAllBooks(pagination)
        } catch (error) {
            if(error instanceof HttpException){
               throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }



    async findBook(bookid: string): Promise<BookDocument> {
        try {
            const book=await this._userRepository.findBybookId(bookid)
            return book
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }
    

    async borrowBook(bookId: string, userId: string): Promise<userDocument> {
        try {
            if(!Types.ObjectId.isValid(bookId) || !Types.ObjectId.isValid(userId)){
                throw new BadRequestException('Invalid userId or bookId')
            }

            const user=await this._userRepository.findById(userId)
            if(!user){
                throw new NotFoundException(MESSAGE.USER.NOT_FOUND)
            }

             if(user.borrowedBooks.length>=3){
                throw new BadRequestException('Borrow limit exceeded')
            }

            const book=await this._userRepository.findBybookId(bookId)
            if(!book){
                throw new NotFoundException(MESSAGE.BOOK.NOT_FOUND)
            }

            const bookObjectId=new Types.ObjectId(bookId)

            const exist=user.borrowedBooks.some(id=>id.equals(bookObjectId))

            if(exist){
                throw new ConflictException(MESSAGE.BOOK.ALREADY_EXISTS)
            }

            const updateUser=await this._userRepository.addBorrowedBook(userId,bookObjectId)

            if(!updateUser){
                throw new BadRequestException('Failed to borrow book')
            }

            return updateUser
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }



    async returnBook(bookId: string, userId: string): Promise<userDocument> {
        try {
            if(!Types.ObjectId.isValid(bookId)||!Types.ObjectId.isValid(userId)){
                throw new BadRequestException('Invalid bookId or UserId')
            }

            const user=await this._userRepository.findById(userId)
            if(!user){
                throw new NotFoundException(MESSAGE.USER.NOT_FOUND)
            }

           

            const book=await this._userRepository.findBybookId(bookId)
            if(!book){
                throw new NotFoundException(MESSAGE.BOOK.NOT_FOUND)
            }

            let bookObjectId=new Types.ObjectId(bookId)

            const exist=user.borrowedBooks.some(id=>id.equals(bookObjectId))

            if(!exist){
                throw new NotFoundException('Not borrowed this')
            }

            const updateborrow=await this._userRepository.returnBook(userId,bookObjectId)

            if(!updateborrow){
                throw new NotFoundException('book returning failed')
            }

            return updateborrow
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }



    async borrowedBooks(userId: string): Promise<userDocument> {
        try {
            return this._userRepository.borrowedBooks(userId)
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async fetchAllUsers(paginationDto: paginationDto): Promise<paginatedUserResponse> {
        try {
            const users=await this._userRepository.findAllUsers(paginationDto)
            if(!users){
                throw new NotFoundException('Users not found')
            }
            return users
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }


}
