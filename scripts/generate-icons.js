const fs = require('fs');
const path = require('path');

// Пути
const iconsDir = path.join(__dirname, '../src/assets/icons');
const outputFile = path.join(__dirname, '../src/assets/icons-list.json');

// 1. Проверяем, существует ли папка
if (!fs.existsSync(iconsDir)) {
  console.error(`❌ Folder not found: ${iconsDir}`);
  // Создаем пустой файл, чтобы приложение не упало
  fs.writeFileSync(outputFile, JSON.stringify([]));
  process.exit(0);
}

// 2. Читаем файлы
const files = fs.readdirSync(iconsDir);

// 3. Фильтруем только .svg и убираем расширение
const iconNames = files
  .filter((file) => file.endsWith('.svg'))
  .map((file) => file.replace('.svg', ''));

// 4. Записываем JSON
fs.writeFileSync(outputFile, JSON.stringify(iconNames, null, 2));

console.log(`✅ Icons list generated: ${iconNames.length} icons found.`);
console.log(`📂 Saved to: ${outputFile}`);
