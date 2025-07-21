import { Component } from '@angular/core';
import { AuthService } from '../../services/userService/authService/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
   constructor(private _authService:AuthService,private _router:Router,private _snackBar:MatSnackBar){}

   logOut(){
     this._authService.logout().subscribe({
      next:(response:{message:string})=>{
        localStorage.removeItem('access_token')
        this._router.navigate(['/user/login'])
      },
      error:(error:HttpErrorResponse)=>{
        console.log(error)
        this._snackBar.open(error.error.message,'close',{duration:3000})
      }
     })
   }
   
}
