import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from '../shared/services/notification.service';
import { SnackbarService } from '../shared/services/snackbar.service'; // Добавлено
import { AlertType, AlertStatus, CreateAlertPayload, UpdateAlertPayload } from '../../models/alerts';
import { LoggerService } from '../shared/services/logger.service';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  id?: string;
  deletedCount?: number;
  movedCount?: number;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class UniversalAlertsApiService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private snackbarService = inject(SnackbarService); // Внедряем новый сервис
  private logger = inject(LoggerService);

  private readonly baseUrl = environment.alertsUrl;

  private fmt(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private handleError(action: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = 'Неизвестная ошибка';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        errorMessage = `Ошибка ${error.status}: ${error.error?.message || error.error?.error || error.message
          }`;
      }
      const fullMessage = `${action} — ${errorMessage}`;
      this.logger.error(`[UniversalApi] ${fullMessage}`, error);
      this.notificationService.error(fullMessage);
      return throwError(() => new Error(fullMessage));
    };
  }

  // ============================================
  // 📥 GET
  // ============================================

  public getAlerts<T>(type: AlertType, status: AlertStatus): Observable<ApiResponse<T[]>> {
    return this.http
      .get<ApiResponse<T[]>>(`${this.baseUrl}/${type}/${status}`)
      .pipe(catchError(this.handleError(`Loading ${this.fmt(type)}/${this.fmt(status)}`)));
  }

  public async getAlertsAsync<T>(type: AlertType, status: AlertStatus): Promise<T[]> {
    const res = await firstValueFrom(this.getAlerts<T>(type, status));
    const data = res.data || [];

    // 👇 АВТОМАТИЧЕСКАЯ СОРТИРОВКА
    return data.sort((a: any, b: any) => {
      // 1. Если статус 'triggered' — сортируем по времени срабатывания (activationTime)
      if (status === 'triggered') {
        const timeA = a.activationTime || 0;
        const timeB = b.activationTime || 0;
        return timeB - timeA; // Новые сверху
      }

      // 2. Для 'working' и 'archived' — сортируем по времени создания (createdAt / creationTime)
      // (Проверяем оба варианта названия поля, так как в БД может быть по-разному)
      const dateA = new Date(a.createdAt || a.creationTime || 0).getTime();
      const dateB = new Date(b.createdAt || b.creationTime || 0).getTime();

      return dateB - dateA; // Новые сверху
    });
  }

  // ============================================
  // ➕ ADD
  // ============================================

  public async addAlertAsync(
    type: AlertType,
    status: AlertStatus,
    alert: CreateAlertPayload
  ): Promise<boolean> {
    const obs$ = this.http.post<ApiResponse>(`${this.baseUrl}/${type}/${status}`, alert).pipe(
      tap(() => {
        this.notificationService.success(`${this.fmt(type)} Alert added to ${this.fmt(status)}`);
      }),
      catchError(this.handleError('Adding Alert'))
    );
    const res = await firstValueFrom(obs$);
    return res.success;
  }

  // ============================================
  // ❌ DELETE
  // ============================================

  // 👇 ДОБАВЛЕНО: Удаление одного алерта
  public async deleteAlertAsync(
    type: AlertType,
    status: AlertStatus,
    id: string
  ): Promise<boolean> {
    const obs$ = this.http.delete<ApiResponse>(`${this.baseUrl}/${type}/${status}/${id}`).pipe(
      tap(() => {
        // ЗАМЕНА: Вместо текста показываем палец вверх
        this.snackbarService.showIcon();
      }),
      catchError(this.handleError('Deleting Alert'))
    );

    const res = await firstValueFrom(obs$);
    return res.success;
  }

  public async deleteAlertsBatchAsync(
    type: AlertType,
    status: AlertStatus,
    ids: string[]
  ): Promise<number> {
    const obs$ = this.http
      .post<ApiResponse>(`${this.baseUrl}/${type}/${status}/delete-batch`, ids)
      .pipe(
        tap((res) => {
          // ЗАМЕНА: Вместо текста показываем палец вверх
          this.snackbarService.showIcon();
        }),
        catchError(this.handleError('Deleting Alerts'))
      );

    const res = await firstValueFrom(obs$);
    return res.deletedCount || 0;
  }

  // 👇 ДОБАВЛЕНО: Удаление ВСЕХ алертов
  public async deleteAllAlertsAsync(type: AlertType, status: AlertStatus): Promise<number> {
    const obs$ = this.http.delete<ApiResponse>(`${this.baseUrl}/${type}/${status}/all`).pipe(
      tap((res) => {
        // ЗАМЕНА: Вместо варнинга показываем палец вверх (операция успешна)
        this.snackbarService.showIcon();
      }),
      catchError(this.handleError('Deleting All Alerts'))
    );
    const res = await firstValueFrom(obs$);
    return res.deletedCount || 0;
  }

  // ============================================
  // 📦 MOVE
  // ============================================

  public async moveAlertsAsync(
    type: AlertType,
    from: AlertStatus,
    to: AlertStatus,
    ids: string[]
  ): Promise<number> {
    const body = { ids, from, to };
    const obs$ = this.http.post<ApiResponse>(`${this.baseUrl}/${type}/move`, body).pipe(
      tap((res) => {
        const count = res.movedCount || 0;
        this.notificationService.success(
          `Moved ${count} ${this.fmt(type)} alerts: ${this.fmt(from)} ⟶ ${this.fmt(to)}`
        );
      }),
      catchError(this.handleError(`Move ${this.fmt(from)} ⟶ ${this.fmt(to)}`))
    );
    const res = await firstValueFrom(obs$);
    return res.movedCount || 0;
  }

  // ============================================
  // 🔄 UPDATE
  // ============================================
  public async updateAlertAsync(
    type: AlertType,
    status: AlertStatus,
    id: string,
    payload: UpdateAlertPayload
  ): Promise<boolean> {
    const obs$ = this.http
      .patch<ApiResponse>(`${this.baseUrl}/${type}/${status}/${id}`, payload)
      .pipe(
        tap(() => {
          this.notificationService.success(`Updated ${this.fmt(type)} Alert`);
        }),
        catchError(this.handleError('Updating Alert'))
      );
    const res = await firstValueFrom(obs$);
    return res.success;
  }
}
