import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/userService/authService/auth.service';
import { LoginResponse } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


     LoginForm!:FormGroup

     userType!:string

     constructor(
      private fb:FormBuilder,
      private route:ActivatedRoute,
      private userauthService:AuthService,
      private snackBar:MatSnackBar,
      private router:Router
     ){
        this.LoginForm=this.fb.group({
          emailAddress:['',[Validators.required,Validators.email]],
          password:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
        })
 

        this.route.data.subscribe((data)=>{
          this.userType=data['userType']
        })

     }


     OnSubmit(){
      if(this.LoginForm.invalid){
        return
      }

     
      
        this.userauthService.login(this.LoginForm.value).subscribe({
          next:(response:LoginResponse)=>{
            console.log('login response',response)
               this.snackBar.open('Login SuccessFull','close',{duration:3000})
               if(response.role=='user'){
                 //
                 console.log(response.role,'iten role')
                 this.router.navigate(['/user/userhome'])
               }else if(response.role=='admin'){
                 //navigate
                 this.router.navigate(['/admin/adminhome'])
               }
          },
          error:(error:HttpErrorResponse)=>{
            console.log('login error',error)
            this.snackBar.open(error?.error?.message,'close',{duration:3000})
          }
        })
    
     }



}
