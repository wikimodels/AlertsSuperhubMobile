// ============================================
// 🎯 VIBRATION PATTERNS
// ============================================
export const VIBRATIONS = {
    routine: 30, // Короткая вибрация для обычных действий
    success: 50, // Средняя вибрация для успешных операций
    error: 100, // Длинная вибрация для ошибок
};

// ============================================
// ⏱️ TIMING CONSTANTS
// ============================================
export const TIMING = {
    // Минимальное время анимации загрузки (мс)
    MIN_LOADING_ANIMATION: 1200,

    // Service Worker проверка обновлений
    SW_UPDATE_CHECK_INTERVAL: 6 * 60 * 60 * 1000, // 6 часов
    SW_UPDATE_PROMPT_DELAY: 10000, // 10 секунд

    // Snackbar durations
    SNACKBAR_ICON_DURATION: 1500,
    SNACKBAR_SUCCESS_DURATION: 3000,
    SNACKBAR_ERROR_DURATION: 5000,
    SNACKBAR_WARNING_DURATION: 4000,

    // Задержка между открытием ссылок
    LINK_OPEN_DELAY: 1000,

    // Rotation animation
    REFRESH_ROTATION_DURATION: 1000,
};

// ============================================
// 🎨 UI CONSTANTS
// ============================================
export const UI = {
    // Swipe threshold для screens viewer
    SWIPE_THRESHOLD: 50,

    // Максимальное количество одновременно открываемых ссылок
    MAX_CONCURRENT_LINKS: 1,
};
