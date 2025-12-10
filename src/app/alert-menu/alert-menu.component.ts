import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { VIBRATIONS } from '../../consts';
import { runVibration } from '../functions/run-vibration';

@Component({
  selector: 'app-alert-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './alert-menu.component.html',
  styleUrls: ['./alert-menu.component.scss'],
})
export class AlertMenuComponent implements OnInit {
  private router = inject(Router);

  // Текст кнопки по умолчанию (как в оригинале)
  selectedLabel = 'Triggered Line Alerts';

  ngOnInit() {
    // Подписка на смену URL, чтобы обновлять заголовок кнопки
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateLabel(event.url);
      });

    // Первичная установка
    this.updateLabel(this.router.url);
  }

  updateLabel(url: string) {
    if (url.includes('vwap')) {
      this.selectedLabel = 'Triggered Vwap Alerts';
    } else {
      this.selectedLabel = 'Triggered Line Alerts';
    }
  }

  navigateTo(type: 'line' | 'vwap') {
    this.router.navigate([`triggered/${type}`]);
    runVibration(VIBRATIONS.routine);
  }
}
