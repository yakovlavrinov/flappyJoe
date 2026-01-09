import Phaser from 'phaser'
import { GAME_WIDTH } from './config'

const SPAWN_Y_MIN = 50
const SPAWN_Y_MAX = 200
const FRAME_COUNT = 4
const SCALE_MIN = 0.8
const SCALE_MAX = 1.4
const SPEED_MIN = 20
const SPEED_MAX = 40
const DESTROY_X = -200
const RESPAWN_X = 200

export class CloudManager {
  private scene: Phaser.Scene
  private clouds: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.clouds = this.scene.add.group()
  }

  spawnInitial(count: number) {
    for (let i = 0; i < count; i++) {
      this.spawn(Phaser.Math.Between(0, GAME_WIDTH), Phaser.Math.Between(SPAWN_Y_MIN, SPAWN_Y_MAX))
    }
  }

  spawn(x: number, y: number) {
    const cloud = this.scene.add.sprite(x, y, 'clouds')
    cloud.setFrame(Phaser.Math.Between(0, FRAME_COUNT - 1))

    const scale = Phaser.Math.FloatBetween(SCALE_MIN, SCALE_MAX)
    cloud.setScale(scale)

    const speed = Phaser.Math.Between(SPEED_MIN, SPEED_MAX)

    this.scene.tweens.add({
      targets: cloud,
      x: DESTROY_X,
      duration: ((x - DESTROY_X) / speed) * 1000,
      onComplete: () => {
        cloud.destroy()
        this.spawn(GAME_WIDTH + RESPAWN_X, Phaser.Math.Between(SPAWN_Y_MIN, SPAWN_Y_MAX))
      },
    })

    this.clouds.add(cloud)
  }

  destroy() {
    this.clouds.clear(true, true)
  }
}
