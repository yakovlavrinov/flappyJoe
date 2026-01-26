import Phaser from 'phaser'
import { initYandexSDK } from '../sdk/yandexSdk'

export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics
  private percentText!: Phaser.GameObjects.Text
  private assetText!: Phaser.GameObjects.Text
  private progressFillConfig!: {
    x: number
    y: number
    width: number
    height: number
  }
  private myAudio = [
    'vip-chick',
    'joseph',
    'ku',
    'friend',
    'cool',
    'pores',
    'help',
    'win',
    'joe',
    'start',
    'restart',
  ]

  constructor() {
    super('PreloadScene')
  }

  preload() {
    initYandexSDK().catch((err) => console.error('SDK init failed', err))

    this.load.svg('surfboard', 'assets/surfboard.svg', {
      width: 150,
      height: 350,
    })
    this.load.svg('Joe1', 'assets/Joe1.svg', { width: 120, height: 120 })
    this.load.svg('Joe2', 'assets/Joe2.svg', { width: 120, height: 120 })
    this.load.svg('Joe3', 'assets/Joe3.svg', { width: 120, height: 120 })
    this.load.svg('Joe4', 'assets/Joe4.svg', { width: 120, height: 120 })

    this.load.svg('Joe11', 'assets/Joe11.svg', { width: 120, height: 120 })
    this.load.svg('Joe12', 'assets/Joe12.svg', { width: 120, height: 120 })
    this.load.svg('Joe13', 'assets/Joe13.svg', { width: 120, height: 120 })
    this.load.svg('Joe14', 'assets/Joe14.svg', { width: 120, height: 120 })

    this.load.svg('Joe111', 'assets/Joe111.svg', { width: 120, height: 120 })
    this.load.svg('Joe112', 'assets/Joe112.svg', { width: 120, height: 120 })
    this.load.svg('Joe113', 'assets/Joe113.svg', { width: 120, height: 120 })
    this.load.svg('Joe114', 'assets/Joe114.svg', { width: 120, height: 120 })

    this.load.spritesheet('clouds', 'assets/clouds.png', {
      frameWidth: 128,
      frameHeight: 64,
      endFrame: 3,
    })

    this.load.audio('scream-rooster', 'assets/audio/scream-rooster.wav')
    this.load.audio('game-over', 'assets/audio/game-over.wav')

    this.load.audio('sea', 'assets/audio/sea.wav')

    this.loadAudio()

    this.loader()

  }

  loadAudio() {
    this.myAudio.forEach((el) => this.load.audio(el, `assets/audio/${el}.wav`))
  }

  private loader() {
    this.createLoadingUI()
    this.initLoadingEvents()
  }

  private createLoadingUI() {
    const { width, height } = this.cameras.main

    const centerX = width / 2
    const centerY = height / 2

    const progressBoxX = centerX - 160
    const progressBoxY = centerY - 25
    const progressBoxWidth = 320
    const progressBoxHeight = 50

    this.progressFillConfig = {
      x: centerX - 150,
      y: centerY - 15,
      width: 300,
      height: 30,
    }

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'monospace',
      color: '#ffffff',
    }

    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(progressBoxX, progressBoxY, progressBoxWidth, progressBoxHeight)

    this.progressBar = this.add.graphics()

    this.add
      .text(centerX, centerY - 60, 'Загрузка...', {
        ...textStyle,
        fontSize: '24px',
      })
      .setOrigin(0.5)

    this.percentText = this.add
      .text(centerX, centerY, '0%', {
        ...textStyle,
        fontSize: '20px',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    this.assetText = this.add
      .text(centerX, centerY + 40, '', {
        ...textStyle,
        fontSize: '18px',
      })
      .setOrigin(0.5)
  }

  private initLoadingEvents() {
    const { x, y, width, height } = this.progressFillConfig

    this.load.on('progress', (value: number) => {
      this.percentText.setText(Math.round(value * 100) + '%')
      this.progressBar.clear()
      this.progressBar.fillStyle(0xffffff, 1)
      this.progressBar.fillRect(x, y, width * value, height)
    })

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.assetText.setText('Загружается: ' + file.key)
    })

    this.load.on('complete', () => {
      this.scene.start('MainScene')
    })
  }
}
