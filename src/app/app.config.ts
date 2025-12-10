import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IconsRegistrarService } from './services/icons-registrar.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    // --- Стандартная настройка ---
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    // --- Формы ---
    // ✅ ПРАВИЛЬНЫЙ СПОСОБ для ReactiveFormsModule
    //importProvidersFrom(ReactiveFormsModule),

    // --- HTTP-клиент с поддержкой Interceptors ---
    provideHttpClient(withInterceptors([])),

    // Инициализация
    provideAppInitializer(() => {
      const registrar = inject(IconsRegistrarService);
      // Возвращаем Promise, Angular будет ждать его выполнения перед рендером
      return registrar.registerIcons();
    }),
    // --- Провайдеры для Angular Material ---
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
};
