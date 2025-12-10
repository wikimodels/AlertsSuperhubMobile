import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ButtonsPanelService } from '../../services/buttons-panel.service';
import { SelectionService } from '../../services/generic.selection.service'; // Проверь путь
import { CoinLinksService } from '../../services/coin-links.service';
import { AlertBase } from '../../../../models/alerts';
import { runVibration } from '../../../functions/run-vibration';
import { VIBRATIONS } from '../../../../consts';
import { MatDialog } from '@angular/material/dialog';
import { ScreensViewer } from '../../../screens-viewer/screens-viewer';

@Component({
  selector: 'app-buttons-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
})
export class ButtonsPanelComponent {
  private buttonsService = inject(ButtonsPanelService);
  public selectionService = inject(SelectionService<AlertBase>);
  private coinLinksService = inject(CoinLinksService);
  private dialog = inject(MatDialog);
  // State
  readonly isRotating = toSignal(this.buttonsService.isRotating$, { initialValue: false });
  readonly isAscending = toSignal(this.buttonsService.isAscending$, { initialValue: false });
  readonly count = this.selectionService.count; // Сигнал счетчика

  // --- ACTIONS ---

  onOpenTradingview(): void {
    runVibration(VIBRATIONS.routine);
    const selected = this.selectionService.selectedValues();
    if (selected.length === 0) return;

    selected.slice(0, 1).forEach((item, index) => {
      setTimeout(() => {
        const link = this.coinLinksService.tradingViewLink(item.symbol, item.exchanges);
        if (link) window.open(link, '_blank');
      }, index * 1000);
    });
    this.selectionService.clear();
  }

  onSendRefreshSignal(): void {
    runVibration(VIBRATIONS.routine);
    if (this.isRotating()) return;
    this.buttonsService.sendRefreshSignal();
  }

  onSendDeletionSignal(): void {
    runVibration(VIBRATIONS.routine);
    if (this.count() === 0) return;
    this.buttonsService.sendDeletionSignal();
  }

  onSortDirectionSignal(): void {
    runVibration(VIBRATIONS.routine);
    this.buttonsService.sendSortDirectionSignal();
  }

  /**
   * 🔥 ЛОГИКА SELECT ALL / UNSELECT ALL
   */
  onSendToggleSelectionSignal(): void {
    runVibration(VIBRATIONS.routine);

    if (this.count() > 0) {
      // 1. Если что-то выбрано -> Сбрасываем в 0
      this.selectionService.clear();
    } else {
      // 2. Если 0 -> Посылаем сигнал "Выбрать всё"
      // (Сам список живет в родителе, поэтому просим его сделать выбор)
      this.buttonsService.sendToggleSelectionSignal();
    }
  }

  onShowScreens(): void {
    // 1. Собираем картинки
    const selected = this.selectionService.selectedValues();
    let allImages: string[] = [];

    selected.slice(0, 1).forEach((alert: AlertBase) => {
      // Проверка на наличие поля image (или tvScreensUrls, как у тебя было)
      if (alert.imagesUrls && Array.isArray(alert.imagesUrls)) {
        allImages = allImages.concat(alert.imagesUrls);
      }
    });

    console.log('allImages', allImages);

    // 2. Открываем
    this.dialog.open(ScreensViewer, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal', // <--- ЭТОТ КЛАСС ВАЖЕН (см. пункт 1)
      data: {
        images: allImages,
        startIndex: 0,
      },
    });
    this.selectionService.clear();
  }
}
