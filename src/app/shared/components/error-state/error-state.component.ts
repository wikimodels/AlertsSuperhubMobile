import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-state">
      <div class="error-icon">
        <mat-icon>error_outline</mat-icon>
      </div>
      <h2 class="error-title">{{ title() }}</h2>
      <p class="error-message">{{ message() }}</p>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="retry.emit()"
        class="retry-button">
        <mat-icon>refresh</mat-icon>
        Retry
      </button>
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px; /* Mobile-first: reduced padding */
      text-align: center;
      min-height: 200px; /* Mobile-first: reduced height */

      @media (min-width: 600px) {
        padding: 48px 24px;
        min-height: 400px;
      }
    }

    .error-icon {
      margin-bottom: 20px; /* Reduced from 24px */
      
      mat-icon {
        font-size: 56px; /* Mobile-first: smaller icon */
        width: 56px;
        height: 56px;
        color: #f44336;
        opacity: 0.8;

        @media (min-width: 600px) {
          font-size: 72px;
          width: 72px;
          height: 72px;
        }
      }
    }

    .error-title {
      font-size: 20px; /* Mobile-first: smaller text */
      font-weight: 500;
      margin: 0 0 12px 0;
      color: rgba(0, 0, 0, 0.87);

      @media (min-width: 600px) {
        font-size: 24px;
      }
    }

    .error-message {
      font-size: 14px; /* Mobile-first: smaller text */
      color: rgba(0, 0, 0, 0.6);
      margin: 0 0 24px 0; /* Reduced from 32px */
      max-width: 400px;

      @media (min-width: 600px) {
        font-size: 16px;
        margin: 0 0 32px 0;
      }
    }

    .retry-button {
      mat-icon {
        margin-right: 8px;
      }
    }
  `]
})
export class ErrorStateComponent {
  title = input<string>('Oops! Something went wrong');
  message = input<string>('We couldn\'t load the data. Please try again.');
  retry = output<void>();
}
