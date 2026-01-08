import Phaser from 'phaser'
export class Joe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '')
    this.setDepth(1000)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setScale(0.6)

    const body = this.body as Phaser.Physics.Arcade.Body

    body.setSize(80, 80)
    body.setOffset(60, 35)
    this.setAngle(15)
    this.setFlipX(true)

    this.setCollideWorldBounds(true)
  }

  flap() {
    this.setVelocityY(-300)
  }
}
