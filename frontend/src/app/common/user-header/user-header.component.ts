import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/userService/authService/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-header',
  imports: [RouterLink],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {
  constructor(private _authService:AuthService,private _router:Router,private _snackBar:MatSnackBar){}
   logout(){
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
