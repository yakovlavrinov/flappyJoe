import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config'

const GRAPHICS_DEPTH = 50
const SURFACE_COLOR = 0x1e90ff
const DEEP_COLOR = 0x0b3d91
const WAVE_SPEED = 50
const WAVE_STEP = 10
const WAVE_LENGTH = 100
const WAVE_AMPLITUDE = 6

export class Water {
  private graphics: Phaser.GameObjects.Graphics

  readonly waterY = GAME_HEIGHT - 80
  private time = 0

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics()
    this.graphics.setDepth(GRAPHICS_DEPTH)
    this.graphics.fillGradientStyle(SURFACE_COLOR, SURFACE_COLOR, DEEP_COLOR, DEEP_COLOR, 1)
  }

  update(delta: number) {
    this.time += (delta * WAVE_SPEED) / 1000
    this.draw()
  }

  private draw() {
    this.graphics.clear()
    this.graphics.fillStyle(SURFACE_COLOR, 1)
    this.graphics.beginPath()
    this.graphics.moveTo(0, GAME_HEIGHT)

    for (let x = 0; x <= GAME_WIDTH; x += WAVE_STEP) {
      const y = this.waterY + Math.sin((x + this.time) / WAVE_LENGTH) * WAVE_AMPLITUDE

      this.graphics.lineTo(x, y)
    }

    this.graphics.lineTo(GAME_WIDTH, GAME_HEIGHT)
    this.graphics.closePath()
    this.graphics.fillPath()
  }

  destroy() {
    this.graphics.destroy()
  }
}
