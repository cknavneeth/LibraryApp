import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const loggedInGuard: CanActivateFn = (route, state) => {
    
   const cookieService=inject(CookieService)

   const router=inject(Router)

   const token=localStorage.getItem('access_token')

   if(token){
      router.navigate(['/user/userhome'])
      return false
   }else{
    return true
   }
};
