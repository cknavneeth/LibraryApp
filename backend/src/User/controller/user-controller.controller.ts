import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { registerDto } from '../dto/register.dto';
import { UserServiceService } from '../service/user-service.service';
import { USER_SERVICE } from '../constants/user.constant';
import { IRegisterService } from '../interface/service/service.interface';
import { loginDto } from '../dto/login.dto';
import { MESSAGE } from 'src/Messages/message.constant';
import { addBookDto } from '../dto/addBook.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { editBookDto } from '../dto/editBook.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { paginationDto } from '../dto/pagination.dto';

@Controller('user/library')
export class UserControllerController {

  private logger=new Logger()

  constructor(
    @Inject(USER_SERVICE) private readonly _userService: IRegisterService,
  ) {}

  @Post('register')
  async registerUser(@Body() registerDto: registerDto) {
    try {
      return this._userService.registerUser(registerDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('login')
  async loginUser(@Body() loginDto: loginDto, @Req() req, @Res() res) {
    try {
      this.logger.log('entered login controller')
      const { accessToken, refreshToken ,role } =
        await this._userService.loginUser(loginDto);

    

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      return res.status(200).json({
      success: true,
      message: 'Login successful',
      role,
      accessToken
    });

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }



   @Get('refreshToken')
   async refreshAcccessToken(
    @Req() req,@Res() res
   ){
       try {
           const refreshToken=req.cookies['refresh_token']
           if(!refreshToken){
             throw new UnauthorizedException(MESSAGE.USER.UNAUTHORIZED)
           }
           const accesstoken=await this._userService.refreshAccessToken(refreshToken)

        res.cookie('access_token', accesstoken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });
           return res.json({accesstoken})
       } catch (error) {
           if(error instanceof HttpException){
             throw error 
           }
           throw new InternalServerErrorException(error.message)
       }
   }


   @Post('addBook')
   @UseGuards(JwtAuthGuard)
   @UseInterceptors(
    FileFieldsInterceptor([
    {name:'cover',maxCount:1},
    {name:'pdf',maxCount:1}
   ])
   )
   
   async addBookByAdmin(
    @Body() addBookDto:addBookDto,
    @Req() req,
    @UploadedFiles()
    files:{
      cover?:Express.Multer.File[],
      pdf?:Express.Multer.File[]
    }
   ){

    try {
      const cover=files?.cover?.[0]
      const pdf=files?.pdf?.[0]
      const adminId=req.user.sub
      this.logger.log('entered into to add book')
      return this._userService.addBooks(addBookDto,cover,pdf,adminId)
    } catch (error) {
       if(error instanceof HttpException){
        throw error
       }
       throw new InternalServerErrorException(error.message)
    }

   }


   @Put('editBook/:bookId')
   @UseGuards(JwtAuthGuard)
   @UseInterceptors(
    FileFieldsInterceptor([
      {name:'cover',maxCount:1},
      {name:'pdf',maxCount:1}
    ])
   )
   async editBookByAdmin(
      @Body() editBookDto:editBookDto,
      @Req() req,
      @Param('bookId') bookId:string,
      @UploadedFiles()
      files:{
        cover?:Express.Multer.File[],
        pdf?:Express.Multer.File[]
      }
   ){
    try {
       const cover=files?.cover?.[0] || null
       const pdf=files?.pdf?.[0] || null

       this.logger.log('cover',cover)
       this.logger.log('pdf',pdf)

       const adminId=req.user.sub

       this.logger.log('admin ahneeyy',adminId)

       return await this._userService.editBooks(editBookDto,cover,pdf,adminId,bookId)


    } catch (error) {
       if(error instanceof HttpException){
        throw error
       }
       throw new InternalServerErrorException(error.message)
    }

   }


   @Get('getadminbooks')
   @UseGuards(JwtAuthGuard)
   async getadminbook(
    @Req() req:any
   ){
     try {
      const adminId=req.user.sub
      return await this._userService.getAdminBooks(adminId)
     } catch (error) {
        if(error instanceof HttpException){
          throw error
        }
        throw new InternalServerErrorException(error.message)
     }
   }

   @Get('getuserbooks')
   async getuserbooks(
    @Query() pagination:paginationDto
   ){
     try {
       return await this._userService.getuserbooks(pagination)
     } catch (error) {
           if(error instanceof HttpException){
          throw error
        }
        throw new InternalServerErrorException(error.message)
     }
   }


   @Get('getbookbyid/:bookId')
   async getbookbyid(
    @Param('bookId') bookId:string 
   ){
        try {
           this.logger.log('bookid ahn ith',bookId)
            const book=await this._userService.findBook(bookId)
            return book
        } catch (error) {
          if(error instanceof HttpException){
             throw error
          }
          throw new InternalServerErrorException(error.message)
        }
   }


   @Post('borrow/:bookId')
   @UseGuards(JwtAuthGuard)
   async borrowbook(
    @Param('bookId') bookId:string,@Req() req
   ){
    this.logger.log('entered borrow book controller',bookId)
       try {
          const userId=req.user.sub
          return await this._userService.borrowBook(bookId,userId)
       } catch (error) {
          if(error instanceof HttpException){
            throw error
          }
          throw new BadRequestException(error.message)
       }
   }

   @Post('return/:bookId')
   @UseGuards(JwtAuthGuard)
   async returnbook(
    @Param('bookId') bookId:string,@Req() req
   ){
     try {
      const userId=req.user.sub
      return this._userService.returnBook(bookId,userId)
     } catch (error) {
        if(error instanceof HttpException){
          throw error
        }
        throw new InternalServerErrorException(error.message)
     }
   }


   @Get('borrowedbooks')
   @UseGuards(JwtAuthGuard)
   async borrowedbooks(
    @Req() req
   ){
       try {
        const userId=req.user.sub
        return this._userService.borrowedBooks(userId)
       } catch (error) {
          if(error instanceof HttpException){
            throw error
          }
          throw new InternalServerErrorException(error.message)
       }
   }

   @Post('logout')
   async logoutuser(
    @Req() req,@Res() res
   ){
      try {
         res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true, // Optional: true in production with HTTPS
        sameSite: 'strict',
      });
        return res.status(201).json({message:'Logout successfull'})
      } catch (error) {
         if(error instanceof HttpException){
            throw error
          }
          throw new InternalServerErrorException(error.message)
      }
   }


   @Get('fetchUsers')
   @UseGuards(JwtAuthGuard)
   async fetchUsers(
    @Req() req,
    @Query() paginationDto:paginationDto
   ){
     try {
         return await this._userService.fetchAllUsers(paginationDto)
     } catch (error) {
          if(error instanceof HttpException){
            throw error
          }
          throw new InternalServerErrorException(error.message)
     }
   }






}
