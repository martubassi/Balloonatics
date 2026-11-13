import { GAME_WIDTH, POWERUP_KEYS, KEY_LABEL } from '../config.js';
import { createButton } from '../ui.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    this.add.text(GAME_WIDTH / 2, 280, 'BALLOONATICS', {
      fontFamily: 'Arial', fontSize: '160px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 12
    }).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 560, 'Jugar (local)', () => this.scene.start('MapVoteScene'));
    createButton(this, GAME_WIDTH / 2, 720, 'Online (próximamente)', null, false);

    this.add.text(GAME_WIDTH / 2, 940,
      `J1: WASD + ${KEY_LABEL[POWERUP_KEYS.p1]}      J2: Flechas + ${KEY_LABEL[POWERUP_KEYS.p2]}      ESC: pausa`, {
        fontFamily: 'Arial', fontSize: '36px', color: '#9aa0c8'
      }).setOrigin(0.5);
  }
}
