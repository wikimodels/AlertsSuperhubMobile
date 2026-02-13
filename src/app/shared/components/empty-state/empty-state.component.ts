import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <h2 class="empty-title">{{ title() }}</h2>
      <p class="empty-message">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
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

    .empty-icon {
      margin-bottom: 20px; /* Reduced from 24px */
      
      mat-icon {
        font-size: 56px; /* Mobile-first: smaller icon */
        width: 56px;
        height: 56px;
        color: rgba(0, 0, 0, 0.26);

        @media (min-width: 600px) {
          font-size: 72px;
          width: 72px;
          height: 72px;
        }
      }
    }

    .empty-title {
      font-size: 20px; /* Mobile-first: smaller text */
      font-weight: 500;
      margin: 0 0 12px 0;
      color: rgba(0, 0, 0, 0.87);

      @media (min-width: 600px) {
        font-size: 24px;
      }
    }

    .empty-message {
      font-size: 14px; /* Mobile-first: smaller text */
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
      max-width: 400px;

      @media (min-width: 600px) {
        font-size: 16px;
      }
    }
  `]
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  title = input<string>('No alerts yet');
  message = input<string>('When alerts are triggered, they will appear here.');
}
