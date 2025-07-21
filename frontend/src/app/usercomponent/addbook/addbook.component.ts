import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookService } from '../../services/userService/bookservice/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddBookResponse } from '../../interfaces/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addbook',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './addbook.component.html',
  styleUrl: './addbook.component.scss',
})
export class AddbookComponent {
  BookForm!: FormGroup;

  selectedCoverFile: File | null = null;
  selectedPdfFile: File | null = null;

  isEditMode: boolean = false;
  bookId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly _bookService: BookService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.initForm();

    this.route.paramMap.subscribe((params) => {
      this.bookId = params.get('bookId');
      if (this.bookId) {
        this.isEditMode = true;

        this.BookForm.get('cover')?.clearValidators()
        this.BookForm.get('pdf')?.clearValidators()
        this.BookForm.get('cover')?.updateValueAndValidity()
        this.BookForm.get('pdf')?.updateValueAndValidity()


        this.loadBookData(this.bookId);
      }
    });
  }

  initForm() {
    this.BookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      publisher: ['', [Validators.required, Validators.minLength(3)]],
      publicationYear: [
        null,
        [Validators.required, Validators.pattern('^[0-9]{4}$')],
      ],
      edition: ['', [Validators.required, Validators.minLength(3)]],
      language: ['', [Validators.required, Validators.minLength(3)]],
      genre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      totalCopies: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      availableCopies: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      cover: [null, [Validators.required]],
      pdf: [null, [Validators.required]],
    });
  }

  loadBookData(bookId: string) {
    this._bookService.getBookById(bookId).subscribe((book) => {
      const {coverUrl,pdfUrl,...formValues}=book
      this.BookForm.patchValue(formValues);
    });
  }

  onFileSelect(event: Event, type: 'cover' | 'pdf') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (type == 'cover') {
      this.selectedCoverFile = file!;
      this.BookForm.patchValue({ cover: file });
    } else if (type == 'pdf') {
      this.selectedPdfFile = file!;
      this.BookForm.patchValue({ pdf: file });
    }
  }

  onSubmit() {
    console.log('got called');
    if (this.BookForm.invalid) {
      return;
    }

    let formData = new FormData();

    Object.entries(this.BookForm.value).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (this.isEditMode && this.bookId) {
      this._bookService.updateBook(this.bookId, formData).subscribe({
        next: (response:AddBookResponse) => {
          this.snackBar.open('Book updated successfully', 'close', { duration: 3000 });
          this.router.navigate(['/admin/adminbooklist']); // or wherever
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, 'close', { duration: 5000 });
        }
      });
    }else{
      this._bookService.addBook(formData).subscribe({
      next: (response: AddBookResponse) => {
        this.snackBar.open('Book added Successfully', 'close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/adminbooklist'])
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error happened while adding book', error);
        this.snackBar.open(error.error.message, 'close', { duration: 10000 });
      },
    });

    }

    
  }
}
