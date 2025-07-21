import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {
  sanitizedUrl!: SafeResourceUrl; 


    constructor(@Inject(MAT_DIALOG_DATA) public data: { pdfUrl: string },private sanitizer:DomSanitizer) {}


    ngOnInit(): void {
    // Sanitize the URL in ngOnInit
    if (this.data.pdfUrl) {
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdfUrl);
    }
  }
}
