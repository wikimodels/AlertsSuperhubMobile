import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

// Components
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthComponent } from './auth/auth.component';

// --- GUARDS ---

const privateGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      // Есть юзер? Добро пожаловать. Нет? Редирект на /login
      return user ? true : router.createUrlTree(['/login']);
    })
  );
};

const publicGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      // Уже вошел? На главную.
      return user ? router.createUrlTree(['/']) : true;
    })
  );
};

export const routes: Routes = [
  // 1. СТРАНИЦА ВХОДА (Загрузится в router-outlet под навбаром)
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [publicGuard],
  },

  // 2. ЗАЩИЩЕННЫЙ КОНТЕНТ (Загрузится там же, но ТОЛЬКО если есть права)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [privateGuard], // ⛔ Блокирует доступ к панели и алертам
    children: [
      {
        path: 'triggered/line',
        loadComponent: () =>
          import('./triggered-alert/triggered-alerts').then((m) => m.TriggeredAlertsComponent),
        data: { type: 'line' },
      },
      {
        path: 'triggered/vwap',
        loadComponent: () =>
          import('./triggered-alert/triggered-alerts').then((m) => m.TriggeredAlertsComponent),
        data: { type: 'vwap' },
      },
      { path: '', redirectTo: 'triggered/line', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
