import { Injectable, computed, inject, signal } from '@angular/core';
import { UniversalAlertsApiService } from './universal-alerts-api.service';
import { AlertBase, AlertType } from '../../models/alerts';

@Injectable({
  providedIn: 'root',
})
export class AlertsStateService {
  private api = inject(UniversalAlertsApiService);

  // --- СОСТОЯНИЕ (SIGNALS) ---
  readonly alerts = signal<AlertBase[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly count = computed(() => this.alerts().length);

  // --- ДЕЙСТВИЯ (ACTIONS) ---

  /**
   * Загружает сработавшие алерты
   * Ждет минимум 1.5 секунды (1 цикл анимации CSS), чтобы не было мерцания
   */
  async loadTriggeredAlerts(type: AlertType): Promise<void> {
    this.isLoading.set(true);

    // 1. Создаем таймер на 1500мс (время анимации из CSS)
    const minAnimationTime$ = new Promise((resolve) => setTimeout(resolve, 1200));

    // 2. Создаем запрос к API
    const dataRequest$ = this.api.getAlertsAsync<AlertBase>(type, 'triggered');

    try {
      // 3. Ждем выполнения ОБОИХ промисов параллельно
      // Если API ответит за 0.1с, мы все равно будем ждать 1.5с
      // Если API ответит за 5с, мы будем ждать 5с
      const [_, data] = await Promise.all([minAnimationTime$, dataRequest$]);

      this.alerts.set(data);
    } catch (error) {
      console.error('State load error:', error);
      this.alerts.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Удаляет один алерт
   */
  async deleteAlert(type: AlertType, id: string): Promise<void> {
    this.alerts.update((current) => current.filter((a) => a.id !== id));
    await this.api.deleteAlertAsync(type, 'triggered', id);
  }

  /**
   * Удаляет выбранные алерты (Batch)
   */
  async deleteMany(type: AlertType, ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    this.alerts.update((current) => current.filter((a) => !ids.includes(a.id)));
    await this.api.deleteAlertsBatchAsync(type, 'triggered', ids);
  }

  /**
   * Полная очистка
   */
  async deleteAll(type: AlertType): Promise<void> {
    this.alerts.set([]);
    await this.api.deleteAllAlertsAsync(type, 'triggered');
  }

  /**
   * СОРТИРОВКА (Клиентская)
   */
  sortAlerts(isAscending: boolean): void {
    const current = [...this.alerts()];

    current.sort((a, b) => {
      const timeA = Number(a.activationTime || 0);
      const timeB = Number(b.activationTime || 0);
      const safeA = isNaN(timeA) ? 0 : timeA;
      const safeB = isNaN(timeB) ? 0 : timeB;

      return isAscending ? safeA - safeB : safeB - safeA;
    });

    this.alerts.set(current);
  }
}
