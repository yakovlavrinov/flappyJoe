import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './config'
import { Joe } from './Joe'
import { Surfboard } from './Surfboard'
import { CloudManager } from './CloudManager'
import { Water } from './Water'

export class MainScene extends Phaser.Scene {
  private chickenJoe!: Joe
  private surfboards!: Phaser.Physics.Arcade.Group
  private cloudManager!: CloudManager
  private water!: Water

  constructor() {
    super('MainScene')
  }

  preload() {
    this.load.svg('surfboard', 'assets/surfboard.svg', {
      width: 150,
      height: 350,
    })
    this.load.svg('Joe1', 'assets/Joe1.svg')
    this.load.svg('Joe2', 'assets/Joe2.svg')
    this.load.svg('Joe3', 'assets/Joe3.svg')
    this.load.svg('Joe4', 'assets/Joe4.svg')

    this.load.spritesheet('clouds', 'assets/clouds.png', {
      frameWidth: 128,
      frameHeight: 64,
      endFrame: 3,
    })
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB')

    this.anims.create({
      key: 'Joe-animation',
      frames: [{ key: 'Joe1' }, { key: 'Joe2' }, { key: 'Joe3' }, { key: 'Joe4' }],
      frameRate: 10,
      repeat: -1,
    })

    this.cloudManager = new CloudManager(this)
    this.cloudManager.spawnInitial(5)

    this.water = new Water(this)

    this.surfboards = this.physics.add.group({
      classType: Surfboard,
      runChildUpdate: true,
      allowGravity: false,
      immovable: true,
    })

    this.input.on('pointerdown', () => {
      this.chickenJoe.flap()
    })

    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: this.spawnSurfboard,
      callbackScope: this,
    })

    this.chickenJoe = new Joe(this, 150, GAME_HEIGHT / 2)

    this.chickenJoe.play('Joe-animation')

    // this.physics.add.collider(this.chickenJoe, this.surfboards, this.gameOver, undefined, this)
  }

  update(_time: number, delta: number) {
    this.chickenJoe.update(delta)
    this.water.update(delta)
  }

  private spawnSurfboard() { // вынести в отдельный класс по управлению досками
    const gap = 115
    const plus = Phaser.Math.Between(-100, 100)

    const topSurfboard = new Surfboard(this, GAME_WIDTH, 100 - gap / 2 + plus, true)

    const bottomSurfboard = new Surfboard(this, GAME_WIDTH, 450 + gap / 2 + plus, false)

    this.surfboards.add(topSurfboard)
    this.surfboards.add(bottomSurfboard)

    topSurfboard.setVelocityX(-200)
    bottomSurfboard.setVelocityX(-200)
  }

  private gameOver() {
    this.scene.restart()
  }
}
