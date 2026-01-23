import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config'
import { Joe } from '../entities/Joe'
import { Surfboard } from '../entities/Surfboard'
import { CloudManager } from '../CloudManager'
import { Water } from '../entities/Water'
import { UIManager } from '../UIManager'
import { ScoreTrigger } from '../entities/ScoreTrigger'
import { LanguageManager as i18n } from '../i18n/LanguageManager'

export class MainScene extends Phaser.Scene {
  private chickenJoe!: Joe
  private surfboards!: Phaser.Physics.Arcade.Group
  private cloudManager!: CloudManager
  private water!: Water
  private ui!: UIManager
  private scoreTriggers!: Phaser.GameObjects.Group
  private isPause = true
  private seaSound!: Phaser.Sound.BaseSound
  private prevLeftStickY = 0
  private splashEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  oneSplash = false
  score = 0
  isGameOver = false
  myAudio = ['vip-chick', 'joseph', 'ku', 'friend', 'cool', 'pores', 'help', 'win', 'joe']

  constructor() {
    super('MainScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB')

    this.anims.create({
      key: 'Joe-animation',
      frames: [{ key: 'Joe1' }, { key: 'Joe2' }, { key: 'Joe3' }, { key: 'Joe4' }],
      frameRate: 10,
      repeat: -1,
    })

    this.seaSound = this.sound.add('sea', {
      volume: 1,
      rate: 1,
      detune: 100,
      loop: true,
      delay: 0,
    })
    this.seaSound.play()

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

    this.input.on('pointerdown', this.handleFlap, this)
    this.input.keyboard!.on('keydown-SPACE', this.handleFlap, this)
    this.input.keyboard!.on('keydown-UP', this.handleFlap, this)
    this.input.keyboard!.on('keydown-W', this.handleFlap, this)

    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => !this.isPause && this.spawnSurfboard(),
      callbackScope: this,
    })

    this.chickenJoe = new Joe(this, 150, GAME_HEIGHT / 2)

    this.chickenJoe.play('Joe-animation')
    console.log(this.input.gamepad)
    this.ui = new UIManager(this)
    this.ui.createTitle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, i18n.t('title'))
    this.ui.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, () => this.startGame())
    this.ui.createScoreUI(20, 20, 0)
    this.ui.createLanguageButton()

    this.physics.add.collider(this.chickenJoe, this.surfboards, this.gameOver, undefined, this)

    // В методе create(), где создаётся overlap:
    this.physics.add.overlap(
      this.chickenJoe,
      this.scoreTriggers,
      (_joeAny: any, triggerAny: any) => {
        // Безопасный кастинг — на runtime это точно Joe и ScoreTrigger
        if (this.isGameOver) return
        const trigger = triggerAny as ScoreTrigger

        if (!trigger.scored) {
          trigger.scored = true
          if (this.score % 3 === 0 && this.score !== 0) {
            const audio = this.myAudio[Math.floor(Math.random() * this.myAudio.length)]
            this.sound.play(audio)
          }
          this.score += 1
          this.ui.updateScore(this.score)
        }
      },
      undefined,
      this,
    )

    if (!this.textures.exists('splash-particle')) {
      const graphics = this.make.graphics({ x: 0, y: 0 })

      graphics.fillStyle(0x88ffff, 0.9)
      graphics.fillCircle(6, 6, 5.5)

      graphics.fillStyle(0x10e6e6, 0.7)
      graphics.fillCircle(6, 6, 4)

      graphics.generateTexture('splash-particle', 12, 12)
      graphics.destroy()
    }

    this.splashEmitter = this.add.particles(0, 0, 'splash-particle', {
      x: 0,
      y: 0,
      lifespan: 800,
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      gravityY: 300,
      quantity: 15,
      emitting: false,
      blendMode: 'ADD',
    })
  }
  private handleFlap() {
    if (this.isGameOver) return
    this.chickenJoe?.flap()
  }

  private startGame() {
    this.ui.hideGameOverUI()
    this.ui.hideMenu()
    this.isPause = false
    this.sound.play('start')
  }

  update(_time: number, delta: number) {
    if (this.isPause) {
      this.chickenJoe.setBodyEnable(false)
      return
    }

    this.chickenJoe.update(delta)
    this.water.update(delta)

    const pad = this.input.gamepad?.getPad(0)
    if (pad && pad.axes.length > 1) {
      const currentY = pad.axes[1].getValue()
      const threshold = -0.3
      if (this.prevLeftStickY >= threshold && currentY < threshold) {
        this.handleFlap()
      }
      this.prevLeftStickY = currentY
    }

    if (this.chickenJoe.y >= GAME_HEIGHT - 100) {
      if (this.oneSplash) return
      this.createSplashEffect(this.chickenJoe.x, this.chickenJoe.y)
    }

    if (this.chickenJoe.y >= GAME_HEIGHT - 50) {
      this.oneSplash = true
      this.gameOver()
    }
  }

  private createSplashEffect(x: number, y: number) {
    this.splashEmitter.setPosition(x, y)
    this.splashEmitter.explode()
  }

  private spawnSurfboard() {
    // вынести в отдельный класс по управлению досками
    const gap = 140
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
    if (this.isGameOver) return
    this.sound.stopAll()

    if (this.score > 7) {
      this.sound.play('scream-rooster')
    } else {
      this.sound.play('game-over')
    }
    const highScore = localStorage.getItem('highScore')
    if (!highScore || +highScore < this.score) {
      localStorage.setItem('highScore', String(this.score))
    }

    this.isGameOver = true

    this.time.timeScale = 0

    this.ui.createGameOverUI(this.score, () => this.restartGame())
  }

  private restartGame() {
    this.time.timeScale = 1
    this.physics.world.resume()

    this.oneSplash = false
    this.score = 0
    this.isPause = true
    this.isGameOver = false
    this.sound.play('restart')
    this.scene.restart()
  }
}

// ачивки
