// html-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-html-snackbar',
  template: `<span [innerHTML]="safeHtml"></span>`,
})
export class HtmlSnackbarComponent {
  safeHtml: SafeHtml;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    private sanitizer: DomSanitizer
  ) {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.data);
  }
}
