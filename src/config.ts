import Phaser from 'phaser'
import { MainScene } from './MainScene'

export const GAME_WIDTH = 400
export const GAME_HEIGHT = 600

export const GRAVITY_X = 0
export const GRAVITY_Y = 800

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: GRAVITY_X, y: GRAVITY_Y },
      debug: true,
    },
  },
  scene: [MainScene],
}
