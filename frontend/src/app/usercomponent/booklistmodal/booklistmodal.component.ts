import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddBookResponse } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booklistmodal',
  imports: [CommonModule],
  templateUrl: './booklistmodal.component.html',
  styleUrl: './booklistmodal.component.scss'
})
export class BooklistmodalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { books: AddBookResponse[]; userName: string }

    
  ) {
    
  }

 
}
