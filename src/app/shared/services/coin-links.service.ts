import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CoinLinksService {
  /**
   * Приватный хелпер для проверки наличия биржи (Case Insensitive)
   */
  private hasExchange(exchanges: string[], exchangeName: string): boolean {
    if (!exchanges || exchanges.length === 0) return false;
    const target = exchangeName.toLowerCase();
    return exchanges.some((ex) => ex.toLowerCase().includes(target));
  }

  coinglassLink(symbol: string, exchanges: string[]): string {
    // Приоритет проверок: Binance, затем Bybit (как в оригинале)
    // 1. Binance
    if (this.hasExchange(exchanges, 'binance')) {
      return `https://www.coinglass.com/tv/Binance_${symbol}USDT`;
    }

    // 2. Bybit (только если нет Binance)
    if (this.hasExchange(exchanges, 'bybit')) {
      return `https://www.coinglass.com/tv/Bybit_${symbol}USDT`;
    }

    return '';
  }

  tradingViewLink(symbol: string, exchanges: string[]): string {
    // 1. Check Bybit
    if (this.hasExchange(exchanges, 'bybit')) {
      return `https://www.tradingview.com/chart?symbol=BYBIT:${symbol}USDT.P`;
    }

    // 2. Check Binance (если Bybit не сработал)
    if (this.hasExchange(exchanges, 'binance')) {
      return `https://www.tradingview.com/chart?symbol=BINANCE:${symbol}USDT.P`;
    }

    return '';
  }

  exchangeLink(symbol: string, exchange: string): string {
    const ex = exchange.toLowerCase();

    if (ex.includes('binance')) {
      return `https://www.binance.com/en/futures/${symbol}USDT`;
    }
    if (ex.includes('bybit')) {
      return `https://www.bybit.com/trade/usdt/${symbol}USDT`;
    }

    return '';
  }

  exchangeLogoLink(exchange: string): string {
    const ex = exchange.toLowerCase();

    if (ex.includes('binance')) {
      return 'assets/icons/binance-black.svg';
    }
    if (ex.includes('bybit')) {
      return 'assets/icons/bybit.svg';
    }

    return '';
  }
}
