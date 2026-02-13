import { Injectable, computed, inject, signal } from '@angular/core';
import { UniversalAlertsApiService } from './universal-alerts-api.service';
import { AlertBase, AlertType } from '../../models/alerts';
import { LoggerService } from '../shared/services/logger.service';
import { TIMING } from '../../consts';

@Injectable({
  providedIn: 'root',
})
export class AlertsStateService {
  private api = inject(UniversalAlertsApiService);
  private logger = inject(LoggerService);

  // --- СОСТОЯНИЕ (SIGNALS) ---
  readonly alerts = signal<AlertBase[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null); // ✅ НОВОЕ: Состояние ошибки
  readonly count = computed(() => this.alerts().length);
  readonly hasError = computed(() => this.error() !== null); // ✅ Удобный computed

  // --- ДЕЙСТВИЯ (ACTIONS) ---

  /**
   * Загружает сработавшие алерты
   * Ждет минимум 1.2 секунды (1 цикл анимации CSS), чтобы не было мерцания
   */
  async loadTriggeredAlerts(type: AlertType): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null); // ✅ Сбрасываем предыдущую ошибку

    // 1. Создаем таймер на минимальное время анимации
    const minAnimationTime$ = new Promise((resolve) => setTimeout(resolve, TIMING.MIN_LOADING_ANIMATION));

    // 2. Создаем запрос к API
    const dataRequest$ = this.api.getAlertsAsync<AlertBase>(type, 'triggered');

    try {
      // 3. Ждем выполнения ОБОИХ промисов параллельно
      const [_, data] = await Promise.all([minAnimationTime$, dataRequest$]);

      this.alerts.set(data);
      this.error.set(null); // ✅ Успех - очищаем ошибку
    } catch (error: any) {
      this.logger.error('State load error:', error);
      this.alerts.set([]);

      // ✅ НОВОЕ: Устанавливаем понятное сообщение об ошибке
      const errorMessage = error?.message || 'Failed to load alerts. Please try again.';
      this.error.set(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * ✅ НОВОЕ: Повторная попытка загрузки
   */
  async retry(type: AlertType): Promise<void> {
    await this.loadTriggeredAlerts(type);
  }

  /**
   * ✅ НОВОЕ: Очистка ошибки вручную
   */
  clearError(): void {
    this.error.set(null);
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
