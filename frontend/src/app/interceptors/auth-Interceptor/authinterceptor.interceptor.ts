import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../services/userService/authService/auth.service';
import { inject, Inject } from '@angular/core';
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';

export const authinterceptorInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next:HttpHandlerFn):Observable<HttpEvent<any>> => {

  const authService=inject(AuthService)
 
  let modifiedReq=req.clone({
    withCredentials:true
  })

  return next(modifiedReq).pipe(

      catchError((error:HttpErrorResponse)=>{

         if(error.status==401&&!req.url.includes('/refresh')){
            if(!authService.isRefreshing){
                return authService.refreshToken().pipe(
                  switchMap(()=>{
                     authService.isRefreshing=true
                     authService.refreshSubject.next(true)

                     modifiedReq=req.clone({
                      withCredentials:true
                     })

                     return next(modifiedReq)
                  }),
                   catchError((error:HttpErrorResponse)=>{
                        authService.isRefreshing=false
                        authService.refreshSubject.next(false)

                        authService.logout()
                        return throwError(()=>error)
          
                     })

                )
            }else{
               return authService.refreshSubject.pipe(
                  filter(token=>token==true),
                  take(1),
                  switchMap(()=>{
                    modifiedReq=req.clone({withCredentials:true})
                    return next(req)
                  })
                )
            }


         }

         return throwError(()=>error)

      })

  )





};
