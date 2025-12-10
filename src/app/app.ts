import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Нужен для открытия окна

// Components

import { ButtonsPanelComponent } from './shared/components/buttons-panel/buttons-panel.component';

// Services

import { Navbar } from './navbar/navbar';
import { AlertBase } from '../models/alerts';
import { SwUpdateService } from './services/sw-update.service';
import { SelectionService } from './shared/services/generic.selection.service';

// TODO: Раскомментировать, когда создадим этот компонент (следующий шаг)
// import { AlertDetailsDialogComponent } from './features/alert-details-dialog/alert-details-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    ButtonsPanelComponent,
    MatDialogModule, // ✅ Не забываем модуль диалогов
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  // Инъекции
  private swUpdateService = inject(SwUpdateService);
  private selectionService = inject(SelectionService<AlertBase>);
  private dialog = inject(MatDialog); // ✅ Сервис диалогов

  ngOnInit(): void {
    this.swUpdateService.init();
  }

  // ✅ Та самая функция
  onOpenDetails(): void {
    // 1. Получаем выбранный алерт
    const selected = this.selectionService.selectedValues();

    if (selected.length === 0) {
      return; // Если ничего не выбрано, ничего не делаем
    }

    const alertItem = selected[0]; // Берем первый (так как просмотр по одному)

    // 2. Открываем диалог
    this.dialog.open(
      // AlertDetailsDialogComponent, // 🚧 Подставим сюда класс компонента
      null as any, // Временная заглушка, пока файла нет
      {
        data: alertItem, // Передаем данные алерта внутрь
        maxWidth: '100vw', // На мобилках - на всю ширину
        maxHeight: '100vh', // На всю высоту
        height: '100%', // Полный экран
        width: '100%', // Полный экран
        panelClass: 'full-screen-dialog', // Класс для стилизации (уберем отступы)
        autoFocus: false, // Чтобы не скакало на кнопки
      }
    );
  }
}
