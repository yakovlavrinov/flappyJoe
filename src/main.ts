import Phaser from 'phaser'
import { gameConfig } from './config'

new Phaser.Game(gameConfig)

// if ('serviceWorker' in navigator && !window.ysdk) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then(() => console.log('Service Worker registered'))
//       .catch((err) => console.error('SW registration failed:', err))
//   })
// }
