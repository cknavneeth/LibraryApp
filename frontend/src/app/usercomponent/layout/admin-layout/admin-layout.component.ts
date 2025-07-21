import { Component } from '@angular/core';
import {Router, RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../../common/admin-header/admin-header.component';
import { AdminSidebarComponent } from '../../../common/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,AdminHeaderComponent,AdminSidebarComponent,CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  
  showLayout=false

  constructor(private router:Router){
    this.router.events.subscribe(()=>{
      const authRoutes=['admin/adminlogin','admin/adminregister']

      this.showLayout=!authRoutes.includes(this.router.url.slice(1))
    })
  }

  
}
