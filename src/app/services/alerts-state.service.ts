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
   */
  async loadTriggeredAlerts(type: AlertType): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.api.getAlertsAsync<AlertBase>(type, 'triggered');
      this.alerts.set(data);
    } catch (error) {
      console.error('State load error:', error);
      // При ошибке можно обнулять список или оставлять старый
      this.alerts.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Удаляет один алерт
   */
  async deleteAlert(type: AlertType, id: string): Promise<void> {
    // Оптимистичное обновление UI
    this.alerts.update((current) => current.filter((a) => a.id !== id));

    // Запрос к API
    await this.api.deleteAlertAsync(type, 'triggered', id);
  }

  /**
   * Удаляет выбранные алерты (Batch)
   */
  async deleteMany(type: AlertType, ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    // 1. Оптимистичное обновление (сразу убираем с экрана)
    this.alerts.update((current) => current.filter((a) => !ids.includes(a.id)));

    // 2. Отправляем запрос
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
   * Добавил этот метод, так как кнопка сортировки в панели обращается к нему.
   * Он не делает запросов, просто меняет порядок в сигнале.
   */
  sortAlerts(isAscending: boolean): void {
    const current = [...this.alerts()];

    current.sort((a, b) => {
      // 1. Принудительно приводим к числу. Если там null/undefined -> станет 0
      // Если там битая строка -> станет NaN (и мы это обработаем)
      const timeA = Number(a.activationTime || 0);
      const timeB = Number(b.activationTime || 0);

      // 2. Защита от NaN. Если прилетел мусор, считаем его равным 0
      const safeA = isNaN(timeA) ? 0 : timeA;
      const safeB = isNaN(timeB) ? 0 : timeB;

      return isAscending ? safeA - safeB : safeB - safeA;
    });

    // 3. Дополнительная проверка: обновился ли массив?
    // Иногда UI не перерисовывается, если ссылка на массив та же самая,
    // но в Angular Signal .set([...]) создает новую ссылку, так что тут ок.
    this.alerts.set(current);
  }
}
