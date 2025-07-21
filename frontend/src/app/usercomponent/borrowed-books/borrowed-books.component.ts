import { Component, OnInit } from '@angular/core';
import { AddBookResponse, userDocument } from '../../interfaces/user.interface';
import { BookService } from '../../services/userService/bookservice/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { PdfViewerComponent } from '../../common/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-borrowed-books',
  imports: [CommonModule],
  templateUrl: './borrowed-books.component.html',
  styleUrl: './borrowed-books.component.scss'
})
export class BorrowedBooksComponent implements OnInit{
  borrowedBooks:AddBookResponse[]=[]
  isLoading=true

  constructor(
    private _bookService:BookService,
    private _snackBar:MatSnackBar,
    private dialog:MatDialog
  ){}

  ngOnInit(): void {
    this.fetchBorrows()
  }

  fetchBorrows(){
     this._bookService.fetchBorrows().subscribe({
      next:(response:userDocument)=>{
        console.log('response',response)
        this.borrowedBooks=response?.borrowedBooks
        this._snackBar.open('borrows fetched','close',{duration:3000})
        this.isLoading=false
      },
      error:(error:any)=>{
        console.log(error.error.message)
        this._snackBar.open(error?.error?.message,'close',{duration:3000})
        
      }
    })
  }


   returnBook(bookId:string){
    const dialogRef=this.dialog.open(ConfirmDialogComponent,{
        width: '350px',
        data: {
             message: 'Are you sure you want to return this book?'
         }
    })

    dialogRef.afterClosed().subscribe((result)=>{
      if(result){
          this._bookService.returnBook(bookId).subscribe({
        next:(response:userDocument)=>{
          this.borrowedBooks=this.borrowedBooks.filter(item=>item._id!==bookId)
          this._snackBar.open('Returned successfully','close',{duration:3000})
          
        },
        error:(error:any)=>{
          console.log(error)
          console.log(error.error.message)
          this._snackBar.open(error.error.message,'close',{duration:3000})
        }
       })
      }
    })
       
    }


openPdfModal(pdfUrl: string): void {
  this.dialog.open(PdfViewerComponent, {
    width: '80%',
    data: { pdfUrl }
  });
}

}
