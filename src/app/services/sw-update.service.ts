import { Injectable, NgZone, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  private swUpdate = inject(SwUpdate);
  private ngZone = inject(NgZone);

  init() {
    // 1. Проверка включения Service Worker
    if (!this.swUpdate.isEnabled) {
      console.log('Service workers are not enabled.');
      return;
    }

    // 2. Слушаем обновления
    // В Angular 16+ 'available' заменено на 'versionUpdates'
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe((event) => {
        console.log('New version available:', event);
        console.log('Current version:', event.currentVersion);
        console.log('Available version:', event.latestVersion);

        // Логика из старого проекта:
        // Ждем 10 секунд, затем спрашиваем пользователя.
        // Если отказ или игнор — все равно перезагружаем.
        const timeout = setTimeout(() => {
          if (confirm('A new version is available. Reload now?')) {
            this.activateUpdate();
          } else {
            this.activateUpdate(); // Force reload after timeout/cancel
          }
        }, 10000); // 10 seconds

        // Очистка таймаута, если пользователь перезагрузил страницу сам раньше
        window.addEventListener('beforeunload', () => clearTimeout(timeout));
      });
  }

  activateUpdate() {
    // Принудительная перезагрузка страницы вне зоны Angular
    this.ngZone.runOutsideAngular(() => {
      window.location.reload();
    });
  }
}
