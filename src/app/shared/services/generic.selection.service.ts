import { Injectable, signal, computed } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root',
})
export class SelectionService<T> {
  // 1. Используем CDK SelectionModel для "грязной" работы (логика toggle, select)
  // multiple = true, initialValue = []
  private readonly cdkSelection = new SelectionModel<T>(true, []);

  // 2. Основной сигнал состояния
  // Приватен, чтобы снаружи нельзя было сделать .set(), только через методы
  private readonly _selected = signal<T[]>([]);

  // 3. Публичные сигналы (Read-only)
  // Список выбранных элементов (для отправки в API)
  readonly value = this._selected.asReadonly();

  // Счетчик (для бейджика в ButtonsPanel)
  readonly count = computed(() => this.value().length);

  // Флаг наличия выбора (для дизейбла кнопок)
  readonly hasValue = computed(() => this.value().length > 0);

  // --- МЕТОДЫ УПРАВЛЕНИЯ ---

  select(...items: T[]): void {
    if (items.length > 0) {
      this.cdkSelection.select(...items);
      this.syncSignal();
    }
  }

  deselect(item: T): void {
    this.cdkSelection.deselect(item);
    this.syncSignal();
  }

  toggle(item: T): void {
    this.cdkSelection.toggle(item);
    this.syncSignal();
  }

  /**
   * Выбирает все переданные элементы (обычно текущий список на экране)
   * Если все уже выбраны -> снимает выделение.
   * Если не все -> довыбирает остальные.
   */
  toggleAll(items: T[]): void {
    const isAllSelected = this.isAllSelected(items);
    if (isAllSelected) {
      this.clear();
    } else {
      this.cdkSelection.select(...items);
      this.syncSignal();
    }
  }

  clear(): void {
    this.cdkSelection.clear();
    this.syncSignal();
  }

  // --- ПРОВЕРКИ ---

  isSelected(item: T): boolean {
    return this.cdkSelection.isSelected(item);
  }

  /**
   * Проверяет, выбраны ли ВСЕ элементы из переданного списка.
   * Важно: сравниваем длину пересечения, а не просто длину массивов,
   * чтобы избежать ошибок при пагинации.
   */
  isAllSelected(viewItems: T[]): boolean {
    if (!viewItems || viewItems.length === 0) return false;
    const selected = this.cdkSelection.selected;
    // Простая проверка: если количество выбранных < количества на экране - точно false
    if (selected.length < viewItems.length) return false;

    // Строгая проверка: все ли viewItems есть в selected
    return viewItems.every((item) => this.cdkSelection.isSelected(item));
  }

  // Получить "сырой" массив (для совместимости с легаси кодом, если где-то нужен не сигнал)
  selectedValues(): T[] {
    return this.cdkSelection.selected;
  }

  // --- PRIVATE ---

  // Синхронизируем состояние CDK модели с нашим Сигналом
  private syncSignal(): void {
    // Создаем новый массив ссылки, чтобы триггернуть сигнал
    this._selected.set([...this.cdkSelection.selected]);
  }
}
