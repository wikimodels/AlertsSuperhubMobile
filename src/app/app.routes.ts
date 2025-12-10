import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Line Alerts
  {
    path: 'triggered/line',
    loadComponent: () =>
      import('./triggered-alert/triggered-alerts').then((m) => m.TriggeredAlertsComponent),
    data: { type: 'line' },
  },

  // 2. VWAP Alerts
  {
    path: 'triggered/vwap',
    loadComponent: () =>
      import('./triggered-alert/triggered-alerts').then((m) => m.TriggeredAlertsComponent),
    data: { type: 'vwap' },
  },

  // 3. Редиректы по умолчанию
  { path: '', redirectTo: 'triggered/line', pathMatch: 'full' },
  { path: '**', redirectTo: 'triggered/line' },
];
