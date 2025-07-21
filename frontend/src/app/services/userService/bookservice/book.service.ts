import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { AddBookRequest, AddBookResponse, PaginatedBookResponse, paginatedUserResponse, userDocument } from '../../../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }

  private apiUrl=`${environment.apiUrl}/user/library`

  addBook(formData:FormData):Observable<AddBookResponse>{
    return this.http.post<AddBookResponse>(`${this.apiUrl}/addBook`,formData)
  }

  fetchAdminAdded():Observable<AddBookResponse[]>{
     return this.http.get<AddBookResponse[]>(`${this.apiUrl}/getadminbooks`)
  }

  fetchAllBooks(page:number=1,limit:number=10):Observable<PaginatedBookResponse>{
     
     return this.http.get<PaginatedBookResponse>(`${this.apiUrl}/getuserbooks?page=${page}&limit=${limit}`)
  }

  getBookById(bookId:string):Observable<AddBookResponse>{
    return this.http.get<AddBookResponse>(`${this.apiUrl}/getbookbyid/${bookId}`)
  }


  updateBook(bookId:string,formData:FormData):Observable<AddBookResponse>{
    return this.http.put<AddBookResponse>(`${this.apiUrl}/editBook/${bookId}`,formData)
  }

  borrowBook(bookId:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/borrow/${bookId}`,{})
  }

  fetchBorrows():Observable<userDocument>{
    return this.http.get<userDocument>(`${this.apiUrl}/borrowedbooks`)
  }

  returnBook(bookId:string):Observable<userDocument>{
    return this.http.post<userDocument>(`${this.apiUrl}/return/${bookId}`,{})
  }

  fetchAllUsers(page:number=1,limit:number=10):Observable<paginatedUserResponse>{
    return this.http.get<paginatedUserResponse>(`${this.apiUrl}/fetchUsers/?page=${page}&limit=${limit}`)
  }

}
