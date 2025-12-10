import { Component, Inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ScreensViewerData {
  images: string[];
  startIndex?: number;
}

@Component({
  selector: 'app-screens-viewer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './screens-viewer.html',
  styleUrls: ['./screens-viewer.scss'],
})
export class ScreensViewer {
  readonly images = signal<string[]>([]);
  readonly currentIndex = signal(0);

  // (2) ЗУМ: Состояние зума
  readonly isZoomed = signal(false);

  private touchStartX = 0;
  private touchEndX = 0;

  constructor(
    public dialogRef: MatDialogRef<ScreensViewer>,
    @Inject(MAT_DIALOG_DATA) public data: ScreensViewerData
  ) {
    if (data.images && data.images.length > 0) {
      this.images.set(data.images);
      this.currentIndex.set(data.startIndex || 0);
    }
    // УБРАЛ else c заглушкой, чтобы показать Empty State
  }

  next(): void {
    const len = this.images().length;
    if (len <= 1) return;
    if (this.currentIndex() < len - 1) {
      this.resetZoom(); // Сброс зума при перелистывании
      this.currentIndex.update((i) => i + 1);
    }
  }

  prev(): void {
    const len = this.images().length;
    if (len <= 1) return;
    if (this.currentIndex() > 0) {
      this.resetZoom();
      this.currentIndex.update((i) => i - 1);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  // (2) ЗУМ: Переключатель
  toggleZoom() {
    this.isZoomed.update((v) => !v);
  }

  resetZoom() {
    this.isZoomed.set(false);
  }

  // --- SWIPE LOGIC ---
  onTouchStart(e: TouchEvent) {
    // Не свайпаем, если картинка увеличена
    if (this.isZoomed()) return;
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent) {
    if (this.isZoomed()) return;
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const threshold = 50;
    if (this.touchEndX < this.touchStartX - threshold) {
      this.next();
    }
    if (this.touchEndX > this.touchStartX + threshold) {
      this.prev();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
    if (event.key === 'Escape') this.close();
  }
}
