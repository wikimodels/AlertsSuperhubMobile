import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AlertBase, VwapAlert } from '../../models/alerts';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatRippleModule],
  templateUrl: './alert-card.html',
  styleUrls: ['./alert-card.scss'],
})
export class AlertCard {
  alert = input.required<AlertBase>();
  type = input.required<'line' | 'vwap'>();
  selected = input(false);
  toggle = output<void>();

  getVwapTime(alert: AlertBase): string {
    const str = (alert as VwapAlert).anchorTimeStr;
    if (!str) return 'N/A';

    const date = new Date(str);
    if (isNaN(date.getTime())) return 'N/A';

    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
