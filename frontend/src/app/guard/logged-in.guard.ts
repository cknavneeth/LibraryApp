import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const loggedInGuard: CanActivateFn = (route, state) => {
    

   const router=inject(Router)

   const token=localStorage.getItem('access_token')

   if(token){
      router.navigate(['/user/userhome'])
      return false
   }else{
    return true
   }
};
