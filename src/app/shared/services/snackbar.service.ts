import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarType } from '../models/snackbar-types.model';
import { HtmlSnackbarComponent } from '../components/html-snackbar/html-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  /**
   * Generic method to show snackbar with dynamic message and action
   */
  showSnackBar(
    message: string,
    action: string = '',
    duration: number = 1000,
    snackbarType: SnackbarType = SnackbarType.Info
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [snackbarType],
    });
  }

  /**
   * Method to show a Snackbar with an SVG icon loaded from a file
   */
  showIcon(duration: number = 2000, svgPath: string = 'assets/icons/thumb-up-in-circle.svg') {
    // Fetch the SVG content from the file
    this.http.get(svgPath, { responseType: 'text' }).subscribe({
      next: (svgContent) => {
        this.snackBar.openFromComponent(HtmlSnackbarComponent, {
          data: svgContent, // Pass the SVG content
          duration: duration,
          horizontalPosition: 'center',
          verticalPosition: 'bottom', // Центрируем иконку по экрану
          // Используем новый класс для прозрачности, который мы добавили в styles.css
          panelClass: ['thumb-up-snackbar-panel'],
        });
      },
      error: (error) => {
        console.error('Failed to load SVG file:', error);
        this.showSnackBar('Error loading icon', '', 3000, SnackbarType.Error);
      },
    });
  }
}
