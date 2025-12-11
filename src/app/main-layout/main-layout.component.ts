import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Components
import { Navbar } from '../navbar/navbar';
import { ButtonsPanelComponent } from '../shared/components/buttons-panel/buttons-panel.component';
import { SelectionService } from '../shared/services/generic.selection.service';
import { AlertBase } from '../../models/alerts';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, ButtonsPanelComponent, MatDialogModule],
  templateUrl: './main-layout.component.html',
  // Стили берем те же, что были в app.scss, можно вынести, но для краткости пропишу здесь структуру
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  private selectionService = inject(SelectionService<AlertBase>);
  private dialog = inject(MatDialog);

  onOpenDetails(): void {
    const selected = this.selectionService.selectedValues();
    if (selected.length === 0) return;

    this.dialog.open(null as any, {
      // Заглушка, как у вас было
      data: selected[0],
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-dialog',
      autoFocus: false,
    });
  }
}
