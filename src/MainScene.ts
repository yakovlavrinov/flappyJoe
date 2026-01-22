import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './config'
import { Joe } from './entities/Joe'
import { Surfboard } from './entities/Surfboard'
import { CloudManager } from './CloudManager'
import { Water } from './entities/Water'
import { UIManager } from './UIManager'
import { ScoreTrigger } from './entities/ScoreTrigger'
import { LanguageManager as i18n } from './i18n/LanguageManager'

export class MainScene extends Phaser.Scene {
  private chickenJoe!: Joe
  private surfboards!: Phaser.Physics.Arcade.Group
  private cloudManager!: CloudManager
  private water!: Water
  private ui!: UIManager
  private scoreTriggers!: Phaser.GameObjects.Group
  private isPause = true
  private seaSound!: Phaser.Sound.BaseSound
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

    this.input.on('pointerdown', () => {
      if (this.isGameOver) return
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
    this.ui.createTitle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, i18n.t('title'))
    this.ui.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, () => this.startGame())
    this.ui.createScoreUI(20, 20, 0)
    this.ui.createLanguageButton();

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
  }

  private startGame() {
    this.ui.hideGameOverUI()
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

    if (this.chickenJoe.y >= GAME_HEIGHT - 50) {
      this.gameOver()
    }
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

    this.score = 0
    this.isPause = true
    this.isGameOver = false
    this.scene.restart()
  }
}

// настроить PWA
// добавить звуки падения в воду, полета, природы
// добавить управление с клавиш пробел стрелка вверх и геймпад
// ачивки
// звук на старт ну что погнали
// звук рестарт ок летс гоу
