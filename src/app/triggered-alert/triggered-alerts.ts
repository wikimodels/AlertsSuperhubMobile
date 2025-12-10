import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

// Models
import { AlertBase, AlertType } from '../../models/alerts';
import { AlertCard } from '../alert-card/alert-card';
import { AlertsStateService } from '../services/alerts-state.service';
import { ButtonsPanelService } from '../shared/services/buttons-panel.service';
import { SelectionService } from '../shared/services/generic.selection.service';

@Component({
  selector: 'app-triggered-alerts',
  standalone: true,
  imports: [CommonModule, AlertCard],
  templateUrl: './triggered-alerts.html',
  styleUrls: ['./triggered-alerts.scss'],
})
export class TriggeredAlertsComponent implements OnInit, OnDestroy {
  // Services
  public alertsState = inject(AlertsStateService);
  public selectionService = inject(SelectionService<AlertBase>);
  private buttonsService = inject(ButtonsPanelService);
  private route = inject(ActivatedRoute);

  private subs: Subscription = new Subscription();
  public currentType: AlertType = 'line'; // 'line' | 'vwap'

  ngOnInit(): void {
    // 1. Следим за URL (triggered/line или triggered/vwap)
    this.subs.add(
      this.route.data.subscribe((data) => {
        // Приводим тип к AlertType
        this.currentType = (data['type'] as AlertType) || 'line';
        this.loadData();
      })
    );

    // 2. Refresh Button
    this.subs.add(
      this.buttonsService.toggleRefreshSubject$.subscribe(() => {
        this.loadData();
      })
    );

    // 3. Delete Button
    this.subs.add(
      this.buttonsService.toggleDeletionSubject$.subscribe(() => {
        const selected = this.selectionService.selectedValues();
        if (selected.length === 0) return;

        // Собираем массив ID
        const idsToDelete = selected.map((a) => a.id);

        // Вызываем метод сервиса (deleteMany)
        this.alertsState.deleteMany(this.currentType, idsToDelete);

        this.selectionService.clear();
      })
    );

    // 4. Sort Button
    this.subs.add(
      this.buttonsService.toggleSortDirectionSubject$.subscribe(() => {
        // Берем текущее направление из сервиса кнопок
        const isAsc = this.buttonsService.isAscendingValue;
        this.alertsState.sortAlerts(isAsc);
      })
    );

    // Внутри ngOnInit()
    this.subs.add(
      this.buttonsService.toggleSelectionSignal$.subscribe(() => {
        // Получаем текущий полный список алертов
        const allAlerts = this.alertsState.alerts();

        if (allAlerts.length > 0) {
          // Проходимся и выделяем каждый (или используем selectMany если есть)
          allAlerts.forEach((alert) => this.selectionService.select(alert));
        }
      })
    );
  }

  loadData() {
    this.selectionService.clear();
    // Вызываем loadTriggeredAlerts (как в твоем оригинале)
    this.alertsState.loadTriggeredAlerts(this.currentType);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onToggleSelection(alert: AlertBase) {
    this.selectionService.toggle(alert);
  }
}
