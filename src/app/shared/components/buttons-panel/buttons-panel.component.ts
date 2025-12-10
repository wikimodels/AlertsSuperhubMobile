import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { ButtonsPanelService } from '../../services/buttons-panel.service';
import { SelectionService } from '../../services/generic.selection.service';
import { CoinLinksService } from '../../services/coin-links.service';
import { AlertBase } from '../../../../models/alerts';
import { runVibration } from '../../../functions/run-vibration';
import { VIBRATIONS } from '../../../../consts';
import { ScreensViewer } from '../../../screens-viewer/screens-viewer';

@Component({
  selector: 'app-buttons-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Orthodox Performance
})
export class ButtonsPanelComponent {
  private buttonsService = inject(ButtonsPanelService);
  public selectionService = inject(SelectionService<AlertBase>);
  private coinLinksService = inject(CoinLinksService);
  private dialog = inject(MatDialog);

  // State (Signals from Service)
  // В обновленном сервисе это уже сигналы, toSignal не нужен
  readonly isRotating = this.buttonsService.isRotating;
  readonly isAscending = this.buttonsService.isAscending;

  readonly count = this.selectionService.count;

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

  onSendToggleSelectionSignal(): void {
    runVibration(VIBRATIONS.routine);

    if (this.count() > 0) {
      this.selectionService.clear();
    } else {
      this.buttonsService.sendToggleSelectionSignal();
    }
  }

  onShowScreens(): void {
    const selected = this.selectionService.selectedValues();
    let allImages: string[] = [];

    selected.slice(0, 1).forEach((alert: AlertBase) => {
      if (alert.imagesUrls && Array.isArray(alert.imagesUrls)) {
        allImages = allImages.concat(alert.imagesUrls);
      }
    });

    console.log('allImages', allImages);

    this.dialog.open(ScreensViewer, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {
        images: allImages,
        startIndex: 0,
      },
    });
    this.selectionService.clear();
  }
}
