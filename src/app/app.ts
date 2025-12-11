import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdateService } from './services/sw-update.service';
import { Navbar } from './navbar/navbar'; // ✅ Вернули Навбар

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar], // ✅ Подключили
  templateUrl: './app.html',
  styles: [],
})
export class App implements OnInit {
  private swUpdateService = inject(SwUpdateService);

  ngOnInit(): void {
    this.swUpdateService.init();
  }
}
