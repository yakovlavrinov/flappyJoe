// новый файл, например ScoreTrigger.ts
import Phaser from 'phaser';

export class ScoreTrigger extends Phaser.GameObjects.Rectangle {
  scored: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number = 20, height: number = 600) {
    super(scene, x, y, width, height, 0xffffff, 0); // полностью прозрачный
    scene.add.existing(this);

    // Важно: добавляем в физику, но без гравитации и immovable
    scene.physics.add.existing(this, false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setVelocityX(-200); // та же скорость, что и у досок
    body.setSize(width, height);
    body.setOffset(-width / 2, -height / 2); // центрируем

    // опционально — для отладки можно включить
    // this.setStrokeStyle(2, 0xff0000);
  }

  update() {
    if (this.x + this.width < -100) {
      this.destroy();
    }
  }
}