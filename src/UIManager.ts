import Phaser from 'phaser'
import type { MainScene } from './MainScene'

export class UIManager {
  private scene!: MainScene
  private titleText!: Phaser.GameObjects.Text
  private startBtn!: Phaser.GameObjects.Text

  private scoreText!: Phaser.GameObjects.Text
  private pauseBtn!: Phaser.GameObjects.Text
  private isPaused: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene as MainScene
  }

  createTitle(x: number, y: number, text: string) {
    this.titleText = this.scene.add
      .text(x, y, text, {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(1001)
  }

  createButton(x: number, y: number, callback: () => void) {
    this.startBtn = this.scene.add
      .text(x, y, 'START', {
        fontSize: '64px',
        color: '#4ecdc4',
        backgroundColor: '#2c3e50',
      })
      .setOrigin(0.5)
      .setPadding(12)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .setDepth(1001)
  }

  /** ===== UI СЧЁТА ===== */
  createScoreUI(x: number, y: number, initialScore: number = 0) {
    this.scoreText = this.scene.add
      .text(x, y, `Score: ${initialScore}`, {
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1001)
  }

  updateScore(score: number) {
    if (!this.scoreText) return
    this.scoreText.setText(`Score: ${score}`)
  }

  /** ===== КНОПКА ПАУЗЫ ===== */
  createPauseButton(x: number, y: number) {
    this.pauseBtn = this.scene.add
      .text(x, y, '⏸', {
        fontSize: '32px',
        color: '#525252',
        // backgroundColor: '#2c3e50',
      })
      .setOrigin(1, 0)
      .setPadding(8)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.togglePause())
      .setScrollFactor(0)
      .setDepth(1001)
  }

  togglePause() {
    this.isPaused = !this.isPaused

    this.scene.physics.world.isPaused = this.isPaused
    this.scene.time.timeScale = this.isPaused ? 0 : 1

    this.pauseBtn.setText(this.isPaused ? '▶' : '⏸')
    // @ts-ignore
    this.isPaused ? this.scene.start() : this.scene.pause()
  }

  hideMenu() {
    this.titleText?.setVisible(false)
    this.startBtn?.setVisible(false)
  }
}
