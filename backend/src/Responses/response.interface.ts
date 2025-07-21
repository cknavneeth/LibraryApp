import { Types } from "mongoose";
import { loginDto } from "src/User/dto/login.dto";

export interface LoginResponse{
     success:boolean,
     message:string
}


export interface Book {
   _id?: string ;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  edition: string;
  language: string;
  genre: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  coverUrl: string;
  pdfUrl: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaginatedBooksResponse {
  books: Book[];
  page: number;
  limit: number;
  totalPages: number;
  totalBooks: number;
}


export interface usersForAdmin{
  _id?:string;
  name:string;
  emailAddress:string,
  password:string;
  role:string
  borrowedBooks:[]
}

export interface paginatedUserResponse{
  users:usersForAdmin[],
  page:number,
  totalPage:number,
  total:number
}

