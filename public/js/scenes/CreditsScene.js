import { GAME_WIDTH, CREDITS, COLORS } from '../config.js';
import { createButton } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

const CARD_COLORS = [COLORS.pip, COLORS.beto, COLORS.balloon, 0x4FD18B];

export class CreditsScene extends Phaser.Scene {
  constructor() { super('CreditsScene'); }

  create() {
    audio.playMusic('menu');

    this.add.text(GAME_WIDTH / 2, 140, 'CRÉDITOS', {
      fontFamily: 'Arial', fontSize: '120px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 10
    }).setOrigin(0.5);

    // Tarjetas 2x2 con los 4 integrantes del equipo (editables en CREDITS, config.js)
    CREDITS.forEach((member, i) => {
      const x = GAME_WIDTH / 2 + (i % 2 === 0 ? -400 : 400);
      const y = 380 + Math.floor(i / 2) * 230;
      this.add.rectangle(x, y, 720, 190, 0x2a2f55, 0.8).setStrokeStyle(8, CARD_COLORS[i % CARD_COLORS.length]);
      this.add.text(x, y - 28, member.name, {
        fontFamily: 'Arial', fontSize: '60px', fontStyle: 'bold', color: '#ffffff'
      }).setOrigin(0.5);
      this.add.text(x, y + 40, member.role, {
        fontFamily: 'Arial', fontSize: '34px', color: '#9aa0c8'
      }).setOrigin(0.5);
    });

    this.add.text(GAME_WIDTH / 2, 800, 'BALLOONATICS · Hecho con Phaser 3', {
      fontFamily: 'Arial', fontSize: '36px', color: '#9aa0c8'
    }).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 930, 'Volver', () => this.scene.start('MenuScene'));
    this.input.keyboard.once('keydown-ESC', () => { audio.play('back'); this.scene.start('MenuScene'); });
  }
}
