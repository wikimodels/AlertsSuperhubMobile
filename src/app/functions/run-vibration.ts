export function runVibration(duration: number) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration); // Vibrate for 500ms
  } else {
    console.warn('Vibration API is not supported on this device.');
  }
}
