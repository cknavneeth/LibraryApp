import { Routes } from '@angular/router';
import { UserLayoutComponent } from './usercomponent/layout/user-layout/user-layout.component';
import { AdminLayoutComponent } from './usercomponent/layout/admin-layout/admin-layout.component';
import { AdminhomeComponent } from './usercomponent/adminhome/adminhome.component';
import { authGuard } from './guard/auth.guard';
import { loggedInGuard } from './guard/logged-in.guard';
import { AddbookComponent } from '../app/usercomponent/addbook/addbook.component';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>{
            return import('../app/usercomponent/login/login.component').then(hai=>hai.LoginComponent)
        },
        canActivate:[loggedInGuard]
    },

    {
        path:'user',
        component:UserLayoutComponent,
        children:[
            {
                path:'register',
                loadComponent:()=>{
                    return import ('../app/usercomponent/register/register.component') .then(m=>m.RegisterComponent)
                },
                data:{userType:'student'},
                canActivate:[loggedInGuard]
            },
            {
                path:'login',
                loadComponent:()=>{
                    return import('../app/usercomponent/login/login.component').then(m=>m.LoginComponent)
                },
                data:{userType:'student'},
                canActivate:[loggedInGuard]
            },
            {
                path:'userhome',
                loadComponent:()=>{
                    return import('../app/usercomponent/userhome/userhome.component').then(m=>m.UserhomeComponent)
                },
                canActivate:[authGuard]
               
            },
           
            {
                path:'userbooklist',
                loadComponent:()=>{
                    return import('../app/usercomponent/booklist/booklist.component').then(m=>m.BooklistComponent)
                },
                data:{userType:'user'},
                canActivate:[authGuard]
            },
            {
                path:'borrowed',
                loadComponent:()=>{
                    return import('../app/usercomponent/borrowed-books/borrowed-books.component').then(m=>m.BorrowedBooksComponent)
                }
            }
           
        ]
    },

    
    {
        path:'admin',
        component:AdminLayoutComponent,
        children:[
             {
                path:'adminregister',
                loadComponent:()=>{
                    return import ('../app/usercomponent/register/register.component') .then(m=>m.RegisterComponent)
                },
                data:{userType:'admin'},
            },
            {
                path:'adminlogin',
                loadComponent:()=>{
                    return import('../app/usercomponent/login/login.component').then(m=>m.LoginComponent)
                },
                data:{userType:'admin'},
                canActivate:[loggedInGuard]
            },
               {
                path:'adminhome',
                loadComponent:()=>{
                    return import('../app/usercomponent/adminhome/adminhome.component').then(m=>m.AdminhomeComponent)
                },
                canActivate:[authGuard]
                
            },
            {
                path:'addbook',
                loadComponent:()=>{
                    return import('../app/usercomponent/addbook/addbook.component').then(m=>m.AddbookComponent)
                },
                data:{userType:'admin'}
                
            },
             {
                path:'adminbooklist',
                loadComponent:()=>{
                    return import('../app/usercomponent/booklist/booklist.component').then(m=>m.BooklistComponent)
                },
                data:{userType:'admin'},
            },
            {
                path:'editbook/:bookId',
                loadComponent:()=>{
                    return import('../app/usercomponent/addbook/addbook.component').then(m=>m.AddbookComponent)
                }
            },
            {
                path:'fetchUsers',
                loadComponent:()=>{
                    return import('../app/usercomponent/user-list/user-list.component').then(m=>m.UserListComponent)
                }
            }
            
        ]
    }


   
];
