import { GAME_WIDTH, COLORS, POWERUP_KEYS, KEY_LABEL } from '../config.js';
import { createButton } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

const PLAYERS = [
  { name: 'PIP · J1', x: 480, color: COLORS.pip, hex: '#E94560',
    rows: [['Mover', 'A / D'], ['Saltar (2 veces = doble salto)', 'W'], ['Bajar plataforma / caer rápido', 'S'], ['Usar potenciador', KEY_LABEL[POWERUP_KEYS.p1]]] },
  { name: 'BETO · J2', x: 1440, color: COLORS.beto, hex: '#0F9BD7',
    rows: [['Mover', '← / →'], ['Saltar (2 veces = doble salto)', '↑'], ['Bajar plataforma / caer rápido', '↓'], ['Usar potenciador', KEY_LABEL[POWERUP_KEYS.p2]]] }
];

const POWERUPS = [
  { key: 'pu_heavy', name: 'GLOBO PESADO', text: 'Aparece en plataformas aéreas. El globo cae más rápido y deriva hacia el campo rival durante 6 s.' },
  { key: 'pu_dash', name: 'DASH', text: 'Aparece tras 5 golpes seguidos. Pulsa el botón para impulsarte: 3 cargas durante 10 s.' },
  { key: 'pu_slip', name: 'ANTIDESLIZANTE', text: 'Aparece en plataformas bajas. Tu rival resbala durante 8 s; tú conservas la tracción.' }
];

export class ControlsScene extends Phaser.Scene {
  constructor() { super('ControlsScene'); }

  create() {
    audio.playMusic('menu');

    this.add.text(GAME_WIDTH / 2, 80, 'CONTROLES', {
      fontFamily: 'Arial', fontSize: '90px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 8
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 155, 'Golpea el globo hacia el campo rival. Si cae en el tuyo, pierdes una vida. No puedes golpearlo dos veces seguidas.', {
      fontFamily: 'Arial', fontSize: '30px', color: '#9aa0c8'
    }).setOrigin(0.5);

    PLAYERS.forEach((p) => {
      this.add.rectangle(p.x, 390, 840, 340, 0x2a2f55, 0.6).setStrokeStyle(6, p.color);
      this.add.text(p.x, 260, p.name, {
        fontFamily: 'Arial', fontSize: '48px', fontStyle: 'bold', color: p.hex
      }).setOrigin(0.5);
      p.rows.forEach(([action, key], i) => {
        const y = 330 + i * 65;
        this.add.text(p.x - 380, y, action, { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' }).setOrigin(0, 0.5);
        this.add.text(p.x + 380, y, key, { fontFamily: 'Arial', fontSize: '36px', fontStyle: 'bold', color: '#F5C518' }).setOrigin(1, 0.5);
      });
    });

    this.add.text(GAME_WIDTH / 2, 600, 'POTENCIADORES', {
      fontFamily: 'Arial', fontSize: '48px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);
    POWERUPS.forEach((pu, i) => {
      const x = 360 + i * 600;
      this.add.image(x, 685, pu.key);
      this.add.text(x, 740, pu.name, { fontFamily: 'Arial', fontSize: '34px', fontStyle: 'bold', color: '#F5C518' }).setOrigin(0.5, 0);
      this.add.text(x, 785, pu.text, {
        fontFamily: 'Arial', fontSize: '26px', color: '#ffffff', align: 'center', wordWrap: { width: 520 }
      }).setOrigin(0.5, 0);
    });

    createButton(this, GAME_WIDTH / 2, 990, 'Volver', () => this.scene.start('MenuScene'), true, 52);
    this.input.keyboard.once('keydown-ESC', () => { audio.play('back'); this.scene.start('MenuScene'); });
  }
}
