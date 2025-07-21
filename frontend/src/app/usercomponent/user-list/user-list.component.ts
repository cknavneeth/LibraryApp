import { Component, ViewChild } from '@angular/core';
import { paginatedUserResponse, userDocument } from '../../interfaces/user.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from '../../services/userService/authService/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../services/userService/bookservice/book.service';
import { BooklistmodalComponent } from '../booklistmodal/booklistmodal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,MatPaginator,MatPaginatorModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
 users:userDocument[] = [];
  totalUsers = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _bookServie: BookService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this._bookServie.fetchAllUsers(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        console.log(response)
        this.users = response.users
        this.totalUsers = response.total;
      },
      error: (err) => console.error(err),
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchUsers()
  }

  openBorrowedBooks(user: userDocument) {

    this.dialog.open(BooklistmodalComponent, {
      width: '600px',
      data: { books: user.borrowedBooks, userName: user.name },
    });

  }


}


