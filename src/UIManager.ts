import Phaser from 'phaser'
import type { MainScene } from './scene/MainScene'
import { LanguageManager as i18n } from './i18n/LanguageManager'

export class UIManager {
  private scene!: MainScene
  private titleText!: Phaser.GameObjects.Text
  private startBtn!: Phaser.GameObjects.Text

  private scoreText!: Phaser.GameObjects.Text

  private gameOverTitle!: Phaser.GameObjects.Text
  private finalScoreText!: Phaser.GameObjects.Text
  private restartBtn!: Phaser.GameObjects.Text
  private langBtn!: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.scene = scene as MainScene
  }

  createTitle(x: number, y: number, text: string) {
    this.titleText = this.scene.add
      .text(x, y, text, {
        fontSize: '40px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(1001)
  }

  createButton(x: number, y: number, callback: () => void) {
    this.startBtn = this.scene.add
      .text(x, y, i18n.t('start'), {
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

  createScoreUI(x: number, y: number, initialScore: number = 0) {
    this.scoreText = this.scene.add
      .text(x, y, `${i18n.t('score')}: ${initialScore}`, {
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
    this.scoreText.setText(`${i18n.t('score')}: ${score}`)
  }

  hideMenu() {
    this.langBtn?.setVisible(false)
    this.titleText?.setVisible(false)
    this.startBtn?.setVisible(false)
  }

  createGameOverUI(score: number, onRestart: () => void) {
    const centerX = this.scene.scale.width / 2
    const centerY = this.scene.scale.height / 2

    this.gameOverTitle = this.scene.add
      .text(centerX, centerY - 160, i18n.t('gameOver'), {
        fontSize: '56px',
        color: '#ff4d4d',
        stroke: '#000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(1002)

    this.finalScoreText = this.scene.add
      .text(centerX, centerY - 80, `${i18n.t('score')}: ${score}`, {
        fontSize: '40px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(1002)

    const highScore = localStorage.getItem('highScore')

    if (highScore) {
      this.scene.add
        .text(centerX, centerY - 20, `${i18n.t('highScore')}: ${highScore}`, {
          fontSize: '40px',
          color: '#ffffff',
          stroke: '#000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(1002)
    }

    this.restartBtn = this.scene.add
      .text(centerX, centerY + 60, i18n.t('restart'), {
        fontSize: '48px',
        color: '#4ecdc4',
        backgroundColor: '#2c3e50',
      })
      .setPadding(12)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onRestart)
      .setDepth(1002)
  }

  hideGameOverUI() {
    this.gameOverTitle?.destroy()
    this.finalScoreText?.destroy()
    this.restartBtn?.destroy()
  }
}
