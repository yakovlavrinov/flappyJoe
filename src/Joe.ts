import Phaser from 'phaser'

const SCALE = 0.6
const BODY_WIDTH = 80
const BODY_HEIGHT = 50
const BODY_OFFSET_X = 60
const BODY_OFFSET_Y = 50
const ANGLE_INIT = 30
const FALL_VELOCITY = 300
const ROTATION_SPEED = 100
const FLAP_VELOCITY = -300

export class Joe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'Joe-animation')

    scene.add.existing(this)
    scene.physics.add.existing(this)
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    this.setScale(isIOS ? SCALE * window.devicePixelRatio : SCALE)

    if (!this.body) return

    
    this.body.setSize(
      isIOS ? BODY_WIDTH / window.devicePixelRatio : BODY_WIDTH,
      isIOS ? BODY_HEIGHT / window.devicePixelRatio : BODY_HEIGHT
    )

    this.body.setOffset(
      isIOS ? BODY_OFFSET_X / window.devicePixelRatio : BODY_OFFSET_X,
      isIOS ? BODY_OFFSET_Y / window.devicePixelRatio : BODY_OFFSET_Y
    )

     this.setDepth(45)

    this.setAngle(ANGLE_INIT)
    this.setFlipX(true)

    this.setCollideWorldBounds(true)
  }

  update(delta: number) {
    if (!this.body) return

    const deltaSeconds = delta / 1000

    this.setBodyEnable(true)

    if (this.body.velocity.y > FALL_VELOCITY) {
      this.angle = this.angle + ROTATION_SPEED * deltaSeconds
    } else {
      if (this.angle > ANGLE_INIT) {
        this.angle = this.angle - ROTATION_SPEED * deltaSeconds
      }
    }
  }

  setBodyEnable(enable: boolean) {
    if (!this.body) return
    this.body.enable = enable
  }

  flap() {
    this.setVelocityY(FLAP_VELOCITY)
  }
}
