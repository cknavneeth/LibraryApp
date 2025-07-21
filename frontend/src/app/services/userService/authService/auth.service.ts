import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, TokenResponse } from '../../../interfaces/user.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isRefreshing=false
  refreshSubject=new BehaviorSubject<boolean>(false)

  constructor(private http:HttpClient) { }

  private apiUrl=`${environment.apiUrl}/user/library`

  register(registerData:RegisterRequest):Observable<RegisterResponse>{
     return this.http.post<RegisterResponse>(`${this.apiUrl}/register`,registerData)
   }

   login(loginData:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`,loginData,{withCredentials:true}).pipe(
      tap((response)=>{
         if(response?.accessToken){
            localStorage.setItem('access_token',response.accessToken)
         }
      })
    )
   }

    getToken(): string | null {
    return localStorage.getItem('access_token');
  }

   refreshToken():Observable<TokenResponse>{
         return this.http.get<TokenResponse>(`${this.apiUrl}/refreshToken`,{withCredentials:true})
   }

   logout():Observable<{message:string}>{
       return this.http.post<{message:string}>(`${this.apiUrl}/logout`,{},{withCredentials:true})
   }
}
