import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService=inject(CookieService)

  const router=inject(Router)

  const token=localStorage.getItem('access_token')

  if(token){
    return true
  }
  else{
    router.navigate(['/user/login'])
    return false
  }
};
