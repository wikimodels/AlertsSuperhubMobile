import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Components
import { AlertMenuComponent } from '../alert-menu/alert-menu.component';
import { VIBRATIONS } from '../../consts';
import { runVibration } from '../functions/run-vibration';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, AlertMenuComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  // Логика кнопки Bitcoin из оригинального nav-bar.component.ts
  onGoToBitcoin() {
    runVibration(VIBRATIONS.routine);
    window.open(`https://www.tradingview.com/chart?symbol=BYBIT:BTCUSDT.P`, '_blank');
  }
}
