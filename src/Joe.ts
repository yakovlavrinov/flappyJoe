import Phaser from 'phaser'

const SCALE = 0.6
const BODY_WIDTH = 80
const BODY_HEIGHT = 80
const BODY_OFFSET_X = 60
const BODY_OFFSET_Y = 35
const ANGLE_INIT = 30
const FALL_VELOCITY = 300
const ROTATION_SPEED = 1.3
const FLAP_VELOCITY = -300

export class Joe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'Joe-animation')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setScale(SCALE)

    if (!this.body) return

    this.body.setSize(BODY_WIDTH, BODY_HEIGHT)
    this.body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y)

    this.setAngle(ANGLE_INIT)
    this.setFlipX(true)

    this.setCollideWorldBounds(true)
  }

  update() {
    if (!this.body) return

    if (this.body.velocity.y > FALL_VELOCITY) {
      this.angle = this.angle + ROTATION_SPEED
    } else {
      this.angle = ANGLE_INIT
    }
  }

  flap() {
    this.setVelocityY(FLAP_VELOCITY)
  }
}
