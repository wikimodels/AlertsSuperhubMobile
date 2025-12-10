import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AlertBase, VwapAlert } from '../../models/alerts';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatRippleModule],
  templateUrl: './alert-card.html',
  styleUrls: ['./alert-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Orthodox Performance
})
export class AlertCard {
  alert = input.required<AlertBase>();
  type = input.required<'line' | 'vwap'>();
  selected = input(false);
  toggle = output<void>();

  // ✅ Computed Signal: вычисляется только один раз при изменении alert()
  anchorTimeFormatted = computed(() => {
    const a = this.alert();
    // Проверка типа через свойство, специфичное для VWAP
    if (this.type() !== 'vwap') return '';

    const str = (a as VwapAlert).anchorTimeStr;
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
  });
}
