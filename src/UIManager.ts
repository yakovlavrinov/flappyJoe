import Phaser from 'phaser'

export class UIManager {
  private scene!: Phaser.Scene
  private titleText!: Phaser.GameObjects.Text
  private startBtn!: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.scene = scene
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
        strokeThickness: 0,
      })
      .setOrigin(0.5)
      .setPadding(12)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .setDepth(1001)
  }

  hideMenu() {
    this.titleText.setVisible(false)
    this.startBtn.setVisible(false)
  }
}
