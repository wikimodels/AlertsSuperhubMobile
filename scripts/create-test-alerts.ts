import { environment } from '../src/environments/environment';

interface CreateAlertPayload {
    symbol: string;
    alertName: string;
    price: number;
    description?: string;
    exchanges: string[];
    category?: number;
    color: string;
    isActive: boolean;
    activationTime: number;
    activationTimeStr: string;
    highPrice?: number;
    lowPrice?: number;
    imagesUrls?: string[];
    logoUrl?: string;
}

// Realistic crypto data
const cryptoData = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', color: '#F7931A', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', category: 1 },
    { symbol: 'ETHUSDT', name: 'Ethereum', color: '#627EEA', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', category: 2 },
    { symbol: 'SOLUSDT', name: 'Solana', color: '#14F195', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png', category: 3 },
    { symbol: 'BNBUSDT', name: 'BNB', color: '#F3BA2F', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', category: 1 },
    { symbol: 'XRPUSDT', name: 'XRP', color: '#23292F', logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', category: 2 },
    { symbol: 'ADAUSDT', name: 'Cardano', color: '#0033AD', logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png', category: 3 },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', color: '#C2A633', logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png', category: 4 },
    { symbol: 'AVAXUSDT', name: 'Avalanche', color: '#E84142', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', category: 1 },
    { symbol: 'DOTUSDT', name: 'Polkadot', color: '#E6007A', logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', category: 2 },
    { symbol: 'MATICUSDT', name: 'Polygon', color: '#8247E5', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png', category: 3 },
];

const exchanges = ['BINANCE', 'BYBIT'];
const alertTypes = ['Support Level', 'Resistance Level', 'Breakout Alert', 'Price Target'];

function randomPrice(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomExchanges(): string[] {
    const random = Math.random();
    if (random < 0.33) {
        return ['BINANCE'];
    } else if (random < 0.66) {
        return ['BYBIT'];
    } else {
        return ['BINANCE', 'BYBIT'];
    }
}

function randomActivationTime(): { timestamp: number; isoString: string } {
    // Random time within last 24 hours
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const timestamp = Math.floor(Math.random() * (now - oneDayAgo) + oneDayAgo);
    const date = new Date(timestamp);
    return {
        timestamp,
        isoString: date.toISOString(),
    };
}

function createAlert(crypto: typeof cryptoData[0], index: number): CreateAlertPayload {
    const basePrice = randomPrice(10, 50000);
    const activation = randomActivationTime();
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];

    return {
        symbol: crypto.symbol,
        alertName: `${crypto.name} ${alertType}`,
        price: basePrice,
        description: `Alert triggered for ${crypto.name} at ${basePrice.toFixed(2)} USDT`,
        exchanges: randomExchanges(),
        category: crypto.category,
        color: crypto.color,
        isActive: false,
        activationTime: activation.timestamp,
        activationTimeStr: activation.isoString,
        highPrice: randomPrice(basePrice * 1.01, basePrice * 1.05),
        lowPrice: randomPrice(basePrice * 0.95, basePrice * 0.99),
        imagesUrls: [
            `https://picsum.photos/seed/${index}/800/600`,
            `https://picsum.photos/seed/${index + 100}/800/600`,
        ],
        logoUrl: crypto.logo,
    };
}

async function createTestAlerts() {
    console.log('🚀 Creating 10 test triggered line alerts...\n');

    const alerts = cryptoData.map((crypto, index) => createAlert(crypto, index));

    let successCount = 0;
    let errorCount = 0;

    for (const alert of alerts) {
        try {
            const response = await fetch(`${environment.alertsUrl}/line/triggered`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${environment.token}`,
                },
                body: JSON.stringify(alert),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Created: ${alert.symbol} - ${alert.alertName}`);
                successCount++;
            } else {
                const error = await response.text();
                console.error(`❌ Failed: ${alert.symbol} - ${response.status} ${response.statusText}`);
                console.error(`   Error: ${error}`);
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ Network error for ${alert.symbol}:`, error);
            errorCount++;
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📍 Total: ${alerts.length}`);
    console.log(`\n🎉 Done! Check the app at http://localhost:4200/triggered/line`);
}

// Run the script
createTestAlerts().catch(console.error);
