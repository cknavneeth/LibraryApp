export interface RegisterResponse{
    _id?:string
    name:string
    emailAddress:string
    password:string
    role:string
}

export interface RegisterRequest{
    name:string,
    emailAddress:string,
    password:string,
    confirmPassword:string,
    role:string
}

export interface LoginResponse{
    success:true,
    message:string,
    role:string
    accessToken:string
}

export interface LoginRequest{
    emailAddress:string,
    password:string
}

export interface TokenResponse{
    accessToken:string,
}

export interface AddBookResponse {
  _id: string;
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

export interface AddBookRequest {
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
}

export interface PaginatedBookResponse{
     books: AddBookResponse[];   
  totalBooks: number;  
  page: number;  
  limit: number; 
}

export interface userDocument{
  name:string
  emailAddress:string,
  password:string,
  role:string,
  borrowedBooks:AddBookResponse[]
}


export interface user{
  _id?:string,
  name:string,
  emailAddress:string,
  password:string
  borrowedBooks:[]
}

export interface paginatedUserResponse{
  users:userDocument[],
  page:number,
  totalPage:number,
  total:number

}