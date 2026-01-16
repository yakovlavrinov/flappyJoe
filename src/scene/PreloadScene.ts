import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  private myAudio = ['vip-chick', 'joseph', 'ku', 'friend', 'cool', 'pores', 'help', 'win', 'joe']

  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.svg('surfboard', 'assets/surfboard.svg', {
      width: 150,
      height: 350,
    })
    this.load.svg('Joe1', 'assets/Joe1.svg', { width: 120, height: 120 })
    this.load.svg('Joe2', 'assets/Joe2.svg', { width: 120, height: 120 })
    this.load.svg('Joe3', 'assets/Joe3.svg', { width: 120, height: 120 })
    this.load.svg('Joe4', 'assets/Joe4.svg', { width: 120, height: 120 })

    this.load.spritesheet('clouds', 'assets/clouds.png', {
      frameWidth: 128,
      frameHeight: 64,
      endFrame: 3,
    })

    this.load.audio('scream-rooster', 'assets/audio/scream-rooster.wav')

    this.load.audio('sea', 'assets/audio/sea.wav')
    this.loadAudio()
  }

  loadAudio() {
    this.myAudio.forEach((el) => this.load.audio(el, `assets/audio/${el}.wav`))
  }
}
