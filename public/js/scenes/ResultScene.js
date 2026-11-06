import { GAME_WIDTH } from '../config.js';
import { createButton } from '../ui.js';

export class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  create(datos) {
    this.add.text(GAME_WIDTH / 2, 320, `¡Gana ${datos.ganador}!`, {
      fontFamily: 'Arial', fontSize: '140px', fontStyle: 'bold', color: datos.color,
      stroke: '#000000', strokeThickness: 10
    }).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 580, 'Revancha', () => this.scene.start('GameScene'));
    createButton(this, GAME_WIDTH / 2, 740, 'Menú principal', () => this.scene.start('MenuScene'));
  }
}
