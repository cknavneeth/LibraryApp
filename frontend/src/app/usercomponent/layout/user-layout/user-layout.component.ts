import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../../common/admin-header/admin-header.component';
import { AdminSidebarComponent } from '../../../common/admin-sidebar/admin-sidebar.component';
import { UserHeaderComponent } from '../../../common/user-header/user-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet,UserHeaderComponent,CommonModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  showLayout=false

  constructor(private router:Router){
    this.router.events.subscribe(()=>{
      const authRoutes=['user/login','user/register']

      this.showLayout=!authRoutes.includes(this.router.url.slice(1))
    })
  }
}
