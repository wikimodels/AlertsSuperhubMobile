import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { TIMING } from '../../../consts';

@Injectable({ providedIn: 'root' })
export class ButtonsPanelService {
  // ==========================================
  // 🧠 STATE (Signals)
  // Используем сигналы для хранения состояния UI
  // ==========================================

  // 1. Вращение иконки (Refresh)
  private readonly _isRotating = signal<boolean>(false);
  // Public Read-only Signal (если кому-то нужно подписаться реактивно)
  readonly isRotating = this._isRotating.asReadonly();

  // Getters/Setters для совместимости с шаблонами (чтобы не ломать [disabled]="service.isRotatingValue")
  get isRotatingValue(): boolean {
    return this._isRotating();
  }
  set isRotatingValue(value: boolean) {
    this._isRotating.set(value);
  }

  // 2. Направление сортировки
  private readonly _isAscending = signal<boolean>(false);
  readonly isAscending = this._isAscending.asReadonly();

  get isAscendingValue(): boolean {
    return this._isAscending();
  }
  set isAscendingValue(value: boolean) {
    this._isAscending.set(value);
  }

  // ==========================================
  // ⚡ EVENTS (Action Streams)
  // Используем Subject для событий (клики кнопок)
  // ==========================================

  // Toggle Deleting
  private readonly _toggleDeletion = new Subject<void>();
  readonly toggleDeletionSubject$ = this._toggleDeletion.asObservable();

  sendDeletionSignal() {
    this._toggleDeletion.next();
  }

  // Toggle Selection
  private readonly _toggleSelection = new Subject<void>();
  readonly toggleSelectionSignal$ = this._toggleSelection.asObservable();

  sendToggleSelectionSignal() {
    this._toggleSelection.next();
  }

  // Toggle Refresh
  private readonly _toggleRefresh = new Subject<void>();
  readonly toggleRefreshSubject$ = this._toggleRefresh.asObservable();

  sendRefreshSignal() {
    this._toggleRefresh.next();
    // Логика UI: крутим иконку 1 секунду
    this._isRotating.set(true);
    setTimeout(() => this._isRotating.set(false), TIMING.REFRESH_ROTATION_DURATION);
  }

  // Toggle Sort Direction
  private readonly _toggleSortDirection = new Subject<void>();
  readonly toggleSortDirectionSubject$ = this._toggleSortDirection.asObservable();

  sendSortDirectionSignal() {
    // 1. Меняем состояние сигнала
    this._isAscending.update((v) => !v);
    // 2. Уведомляем о событии
    this._toggleSortDirection.next();
  }
}
