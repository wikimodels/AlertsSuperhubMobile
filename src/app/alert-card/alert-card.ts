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

    return this.formatDate(str);
  });

  // ✅ Форматирование даты активации: "13 Feb 2026 16:30"
  activationTimeFormatted = computed(() => {
    const str = this.alert().activationTimeStr;
    if (!str) return 'N/A';
    return this.formatDate(str);
  });

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pad = (n: number) => n.toString().padStart(2, '0');

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }
}
