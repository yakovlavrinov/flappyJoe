import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './config'
import { Joe } from './Joe'
import { Surfboard } from './Surfboard'
import { CloudManager } from './CloudManager'
import { Water } from './Water'
import { UIManager } from './UIManager'
import { ScoreTrigger } from './ScoreTrigger'

export class MainScene extends Phaser.Scene {
  private chickenJoe!: Joe
  private surfboards!: Phaser.Physics.Arcade.Group
  private cloudManager!: CloudManager
  private water!: Water
  private ui!: UIManager
  private scoreTriggers!: Phaser.GameObjects.Group
  private flapSound!: Phaser.Sound.BaseSound
  private isPause = true
  score = 0

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

    this.load.audio('flap', 'assets/Петушиный крик.wav')
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB')

    this.anims.create({
      key: 'Joe-animation',
      frames: [{ key: 'Joe1' }, { key: 'Joe2' }, { key: 'Joe3' }, { key: 'Joe4' }],
      frameRate: 10,
      repeat: -1,
    })

    this.flapSound = this.sound.add('flap', {
      volume: 1,
      rate: 1,
      detune: 100,
      loop: false,
      delay: 0,
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

    this.scoreTriggers = this.add.group({
      classType: ScoreTrigger,
      runChildUpdate: true,
    })

    this.input.on('pointerdown', () => {
      this.chickenJoe.flap()
    })

    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => !this.isPause && this.spawnSurfboard(),
      callbackScope: this,
    })

    this.chickenJoe = new Joe(this, 150, GAME_HEIGHT / 2)

    this.chickenJoe.play('Joe-animation')

    this.ui = new UIManager(this)
    this.ui.createTitle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'FLAPPY JOE')
    this.ui.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, () => this.startGame())
    this.ui.createScoreUI(20, 20, 0)
    this.ui.createPauseButton(this.scale.width - 20, 20)

    this.physics.add.collider(this.chickenJoe, this.surfboards, this.gameOver, undefined, this)

   this.physics.add.overlap(this.chickenJoe, this.scoreTriggers, (joe: Joe, trigger: ScoreTrigger)=>{
    if (!trigger.scored) {
      trigger.scored = true;
    console.log('sdf')
    this.score +=1
    this.ui.updateScore(this.score)}
   }, undefined, this)
  }

  private startGame() {
    this.ui.hideMenu()
    this.isPause = false
  }

  update(_time: number, delta: number) {
    if (this.isPause) {
      this.chickenJoe.setBodyEnable(false)
      return
    }

    this.chickenJoe.update(delta)
    this.water.update(delta)
  }

  private spawnSurfboard() {
    // вынести в отдельный класс по управлению досками
    const gap = 125
    const plus = Phaser.Math.Between(-100, 100)

    const topSurfboard = new Surfboard(this, GAME_WIDTH + 100, 100 - gap / 2 + plus, true)

    const bottomSurfboard = new Surfboard(this, GAME_WIDTH + 100, 450 + gap / 2 + plus, false)

    this.surfboards.add(topSurfboard)
    this.surfboards.add(bottomSurfboard)

    topSurfboard.setVelocityX(-200)
    bottomSurfboard.setVelocityX(-200)

    const trigger = new ScoreTrigger(this, GAME_WIDTH + 160, 600) // смещение по x, чтобы засчитывалось после пролёта
    this.scoreTriggers.add(trigger)
  }

  private gameOver() {
    this.flapSound.play()
    this.isPause = true
    this.scene.restart()
  }
}

// настроить PWA
// настроить depth у облаков
// добавить звуки падения в воду, полета, природы
