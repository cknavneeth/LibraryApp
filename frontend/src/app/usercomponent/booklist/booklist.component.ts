import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { BookService } from '../../services/userService/bookservice/book.service';
import { AddBookResponse, PaginatedBookResponse } from '../../interfaces/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-booklist',
  imports: [MatPaginator,MatPaginatorModule,CommonModule,RouterLink,RouterModule],
  templateUrl: './booklist.component.html',
  styleUrl: './booklist.component.scss'
})
export class BooklistComponent implements OnInit{

  userType!:string
  Books:AddBookResponse[]=[]
  totalBooks=0
  pageSize=10
  pageIndex=0


   @ViewChild(MatPaginator) paginator!: MatPaginator;

  

  constructor(private _route:ActivatedRoute,private readonly _bookService:BookService,private _snackBar:MatSnackBar,private dialog:MatDialog){
     this._route.data.subscribe((data)=>{
      this.userType=data['userType']
    })
  }

  ngOnInit(): void {
     this.fetchBook(this.pageIndex+1,this.pageSize)
  }

  fetchBook(page:number,limit:number){
     if(this.userType==='admin'){
          this._bookService.fetchAdminAdded().subscribe({
            next:(response:AddBookResponse[])=>{
              console.log(response)
               this.Books=response
               console.log(this.Books)
               this._snackBar.open('book fetched','close',{duration:3000})
            },
            error:(error:HttpErrorResponse)=>{
              this._snackBar.open(error?.error?.message,'close',{duration:3000})
            }
          })
      }else if(this.userType==='user'){
         this._bookService.fetchAllBooks(page,limit).subscribe({
           next:(response:PaginatedBookResponse)=>{
            console.log(response)
            this.Books=response.books
            this.totalBooks=response.totalBooks
            console.log(this.Books)
           },
           error:(error:HttpErrorResponse)=>{
            console.log(error)
              this._snackBar.open(error?.error?.message,'close',{duration:3000})
           }
         })
      }

  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchBook(this.pageIndex+1,this.pageSize)
  }


  

  borrowBook(bookId:string){
    const dialogRef=this.dialog.open(ConfirmDialogComponent,{
      width: '350px',
        data: {
             message: 'Are you sure you want to return this book?'
         }
    })

    dialogRef.afterClosed().subscribe((result)=>{
      if(result){

         this._bookService.borrowBook(bookId).subscribe({
      next:(response:AddBookResponse[])=>{
        this._snackBar.open('Borrowed congrats','close',{duration:3000})
      },
      error:(error:any)=>{
        console.log(error.error.message)
        console.error(error)
        this._snackBar.open(error?.error?.message,'close',{duration:3000})
      }
     })

      }
    })
    
  }

}
