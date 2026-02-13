import { Injectable, isDevMode } from '@angular/core';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  None = 4,
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  // В production показываем только Warning и Error
  // В development показываем всё
  private currentLogLevel: LogLevel = isDevMode() ? LogLevel.Debug : LogLevel.Warn;

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.Debug, message, args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.Info, message, args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.Warn, message, args);
  }

  error(message: string, error?: any, ...args: any[]): void {
    this.log(LogLevel.Error, message, [error, ...args]);
  }

  private log(level: LogLevel, message: string, args: any[]): void {
    if (level < this.currentLogLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${LogLevel[level]}]`;

    switch (level) {
      case LogLevel.Debug:
        console.log(`${prefix} ${message}`, ...args);
        break;
      case LogLevel.Info:
        console.info(`${prefix} ${message}`, ...args);
        break;
      case LogLevel.Warn:
        console.warn(`${prefix} ${message}`, ...args);
        break;
      case LogLevel.Error:
        console.error(`${prefix} ${message}`, ...args);
        break;
    }
  }

  /**
   * Позволяет динамически изменить уровень логирования
   * Полезно для отладки в production
   */
  setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
    this.info(`Log level changed to: ${LogLevel[level]}`);
  }
}
