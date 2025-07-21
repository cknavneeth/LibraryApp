import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../Validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/userService/authService/auth.service';
import { RegisterResponse } from '../../interfaces/user.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule,MatSnackBarModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
 
  RegisterForm!:FormGroup

  userType!:string

  constructor(
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private readonly userauthService:AuthService,
    private snackBar:MatSnackBar,
    private router:Router
  ){
     this.RegisterForm=this.fb.group({
      name:['',[Validators.required]],
      emailAddress:['',[Validators.required,Validators.email]],
      password:['',[
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword:['',[Validators.required]],
      role:['',[Validators.required]]
     },{Validators:passwordMatchValidator()})


     this.route.data.subscribe((data)=>{
      this.userType=data['userType']
     })

  }

  onSubmit(){
       if(this.RegisterForm.invalid){
        return
       }

       
         this.userauthService.register(this.RegisterForm.value).subscribe({
          next:(response:RegisterResponse)=>{
             this.snackBar.open('Registration Successfull','close',{duration:3000})
             this.router.navigate(['/user/login'])
          },
          error:(error:HttpErrorResponse)=>{
            console.log('Registration Error Response',error)
            this.snackBar.open('Registration failed','close',{duration:3000})
          }
         })
       
  }


}
