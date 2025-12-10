import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class TriggeredAlertsComponent implements OnInit {
  // Services
  public alertsState = inject(AlertsStateService);
  public selectionService = inject(SelectionService<AlertBase>);
  private buttonsService = inject(ButtonsPanelService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public currentType: AlertType = 'line'; // 'line' | 'vwap'

  ngOnInit(): void {
    // 1. Следим за URL (triggered/line или triggered/vwap)
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.currentType = (data['type'] as AlertType) || 'line';
      this.loadData();
    });

    // 2. Refresh Button
    this.buttonsService.toggleRefreshSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadData();
      });

    // 3. Delete Button
    this.buttonsService.toggleDeletionSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const selected = this.selectionService.selectedValues();
        if (selected.length === 0) return;

        const idsToDelete = selected.map((a) => a.id);
        this.alertsState.deleteMany(this.currentType, idsToDelete);

        this.selectionService.clear();
      });

    // 4. Sort Button
    this.buttonsService.toggleSortDirectionSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const isAsc = this.buttonsService.isAscendingValue;
        this.alertsState.sortAlerts(isAsc);
      });

    // 5. Toggle Selection
    this.buttonsService.toggleSelectionSignal$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const allAlerts = this.alertsState.alerts();

        if (allAlerts.length > 0) {
          if (this.selectionService.isAllSelected(allAlerts)) {
            this.selectionService.clear();
          } else {
            // ✅ ИСПРАВЛЕНИЕ: Используем спред-оператор (...)
            this.selectionService.select(...allAlerts);
          }
        }
      });
  }

  loadData() {
    this.selectionService.clear();
    this.alertsState.loadTriggeredAlerts(this.currentType);
  }

  onToggleSelection(alert: AlertBase) {
    this.selectionService.toggle(alert);
  }
}
