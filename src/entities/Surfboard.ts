import Phaser from 'phaser'
const BODY_WIDTH = 40
const BODY_HEIGHT = 350
const BODY_OFFSET_X = 55
const BODY_OFFSET_Y = 1
export class Surfboard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, flipped = false) {
    super(scene, x, y, 'surfboard')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body // проверка наличия или другой подход
    body.setAllowGravity(false)
    body.setImmovable(true)
    body.setSize(BODY_WIDTH, BODY_HEIGHT)
    body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y)

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
