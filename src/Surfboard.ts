import Phaser from 'phaser'

export class Surfboard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, flipped = false) {
    super(scene, x, y, 'surfboard')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body // проверка наличия или другой подход
    body.setAllowGravity(false)
    body.setImmovable(true)
    body.setSize(40, 350)
    body.setOffset(55, 1)

    if (flipped) {
      this.setFlipY(true)
    }
  }

  update() {
    if (this.x + this.width < 0) {
      this.destroy()
    }
  }
}

// Вынести константы 
