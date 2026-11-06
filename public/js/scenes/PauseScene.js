import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { createButton } from '../ui.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }

  create(datos) {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
    this.add.text(GAME_WIDTH / 2, 300, 'PAUSA', {
      fontFamily: 'Arial', fontSize: '120px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 520, 'Continuar', () => {
      this.scene.stop();
      this.scene.resume(datos.escenaOrigen);
    });
    createButton(this, GAME_WIDTH / 2, 680, 'Menú principal', () => {
      this.scene.stop(datos.escenaOrigen);
      this.scene.start('MenuScene');
    });
  }
}
