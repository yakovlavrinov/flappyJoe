import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './config'
import { Joe } from './Joe'
import { Surfboard } from './Surfboard'

export class MainScene extends Phaser.Scene {
  private chickenJoe!: Joe
  private surfboards!: Phaser.Physics.Arcade.Group
  private clouds!: Phaser.GameObjects.Group
  private ocean!: Phaser.GameObjects.Graphics

  private oceanTime = 0

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

    this.ocean = this.add.graphics()
    this.ocean.setDepth(3)

    this.ocean.fillGradientStyle(0x1e90ff, 0x1e90ff, 0x0b3d91, 0x0b3d91, 1)

    this.clouds = this.add.group()

    for (let i = 0; i < 5; i++) {
      this.spawnCloud(Phaser.Math.Between(0, GAME_WIDTH), Phaser.Math.Between(50, 200))
    }

    this.anims.create({
      key: 'Joe-animation',
      frames: [{ key: 'Joe1' }, { key: 'Joe2' }, { key: 'Joe3' }, { key: 'Joe4' }],
      frameRate: 10,
      repeat: -1,
    })

   

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

    this.physics.add.collider(this.chickenJoe, this.surfboards, this.gameOver, undefined, this)
  }

  update(_time: number, delta: number) {
    this.chickenJoe.update(delta)
    this.oceanTime += delta * 0.05
    this.drawOcean()
  }

  private spawnSurfboard() {
    const gap = 115
    const plus = Phaser.Math.Between(-100, 100)
   

    const topSurfboard = new Surfboard(this, GAME_WIDTH, 100 - gap / 2 + plus, true)

    const bottomSurfboard = new Surfboard(this, GAME_WIDTH, 450 + gap / 2 + plus, false)

    this.surfboards.add(topSurfboard)
    this.surfboards.add(bottomSurfboard)

    topSurfboard.setVelocityX(-200)
    bottomSurfboard.setVelocityX(-200)
  }

  private spawnCloud(x: number, y: number) {
    const cloud = this.add.sprite(x, y, 'clouds')
    cloud.setFrame(Phaser.Math.Between(0, 3))

    const scale = Phaser.Math.FloatBetween(0.8, 1.4)
    cloud.setScale(scale)

    const speed = Phaser.Math.Between(20, 40)

    this.tweens.add({
      targets: cloud,
      x: -200,
      duration: ((x + 200) / speed) * 1000,
      onComplete: () => {
        cloud.destroy()
        this.spawnCloud(GAME_WIDTH + 200, Phaser.Math.Between(50, 200))
      },
    })

    this.clouds.add(cloud)
  }

  private drawOcean() {
    const baseY = GAME_HEIGHT - 80
    const amplitude = 6
    const wavelength = 80
    const step = 12

    this.ocean.clear()

    this.ocean.fillStyle(0x1e90ff, 1)
    this.ocean.beginPath()

    // старт снизу слева
    this.ocean.moveTo(0, GAME_HEIGHT)

    for (let x = 0; x <= GAME_WIDTH; x += step) {
      const y = baseY + Math.sin((x + this.oceanTime) / wavelength) * amplitude

      this.ocean.lineTo(x, y)
    }

    // закрываем форму
    this.ocean.lineTo(GAME_WIDTH, GAME_HEIGHT)
    this.ocean.closePath()
    this.ocean.fillPath()
  }

  private gameOver() {
    this.scene.restart()
  }
}
