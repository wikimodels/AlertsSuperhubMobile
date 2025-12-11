import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Services
// NotificationService больше не нужен здесь
import { AlertMenuComponent } from '../alert-menu/alert-menu.component';
import { VIBRATIONS } from '../../consts';
import { runVibration } from '../functions/run-vibration';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AlertMenuComponent,
    MatToolbarModule,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  private authService = inject(AuthService);
  // private notification удален

  user$ = this.authService.user$;

  onGoToBitcoin() {
    runVibration(VIBRATIONS.routine);
    window.open(`https://www.tradingview.com/chart?symbol=BYBIT:BTCUSDT.P`, '_blank');
  }

  login() {
    runVibration(VIBRATIONS.routine);
    // Просто вызываем метод. Уведомления покажет сервис.
    this.authService.loginWithGoogle();
  }

  logout() {
    runVibration(VIBRATIONS.routine);
    this.authService.logout();
  }
}
