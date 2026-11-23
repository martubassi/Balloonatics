import { onSceneKey } from '../sceneInput.js';
import { FONT_DISPLAY } from '../typography.js';
import { GAME_WIDTH, POWERUP_KEYS, KEY_LABEL } from '../config.js';
import { createButton, createBackdrop, createPanel, fitImage } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

const PLAYERS = [
  { name: 'PIP', id: 'pip', x: 500, color: '#ff7189', subtitle: 'JUGADOR 1 · WASD',
    keys: ['A / D', 'W', 'S', KEY_LABEL[POWERUP_KEYS.p1]] },
  { name: 'BETO', id: 'beto', x: 1420, color: '#65dbff', subtitle: 'JUGADOR 2 · FLECHAS',
    keys: ['\u2190 / \u2192', '\u2191', '\u2193', KEY_LABEL[POWERUP_KEYS.p2]] }
];
const ACTIONS = ['Moverse', 'Saltar / doble salto', 'Bajar / caída rápida', 'Usar potenciador'];
const POWERUPS = [
  { key: 'pu_heavy', name: 'GLOBO PESADO', text: 'En plataformas altas. Aumenta la caída del globo hacia el rival durante 6 s.' },
  { key: 'pu_dash', name: 'DASH', text: 'Tras 5 golpes seguidos. Tres impulsos laterales para usar durante 10 s.' },
  { key: 'pu_slip', name: 'ANTIDESLIZANTE', text: 'En plataformas bajas. Hace resbalar a tu rival durante 8 s.' }
];
const TEXT_STYLE = { fontFamily: 'Arial', color: '#e6f0f8' };

export class ControlsScene extends Phaser.Scene {
  constructor() { super('ControlsScene'); }

  create() {
    createBackdrop(this, 0.87);
    this.createHeader();
    this.createPlayerCards();
    this.createPowerUps();
    createButton(this, 960, 995, 'Volver', () => this.scene.start('MenuScene'), true, 46);
    onSceneKey(this, 'keydown-ESC', () => {
      audio.play('back');
      this.scene.start('MenuScene');
    });
  }

  createHeader() {
    this.add.text(GAME_WIDTH / 2, 74, 'CONTROLES', {
      ...TEXT_STYLE, fontSize: '78px', fontFamily: FONT_DISPLAY, fontStyle: 'bold', color: '#f5cf59'
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 151,
      'Lleva el globo al campo rival. Si cae en tu lado, pierdes una vida.\nLos golpes deben alternarse entre jugadores.', {
        ...TEXT_STYLE, fontSize: '28px', color: '#b7cbdc', align: 'center', lineSpacing: 5
      }).setOrigin(0.5);
  }

  createPlayerCards() {
    PLAYERS.forEach((p) => {
      createPanel(this, p.x, 422, 840, 424);
      fitImage(this, p.x - 330, 285, `art_${p.id}`, 66, 100);
      this.add.text(p.x - 270, 260, p.name, {
        ...TEXT_STYLE, fontSize: '44px', fontFamily: FONT_DISPLAY, fontStyle: 'bold', color: p.color
      }).setOrigin(0, 0.5);
      this.add.text(p.x - 270, 308, p.subtitle, {
        ...TEXT_STYLE, fontSize: '24px', color: '#a9c1d5'
      }).setOrigin(0, 0.5);
      this.add.rectangle(p.x, 343, 728, 2, 0x45627b);
      ACTIONS.forEach((action, i) => {
        const y = 380 + i * 61;
        this.add.text(p.x - 355, y, action, { ...TEXT_STYLE, fontSize: '31px' }).setOrigin(0, 0.5);
        createPanel(this, p.x + 260, y, 200, 50, 'key');
        this.add.text(p.x + 260, y, p.keys[i], {
          ...TEXT_STYLE, fontSize: '28px', fontFamily: FONT_DISPLAY, fontStyle: 'bold', color: '#ffe19a'
        }).setOrigin(0.5);
      });
      this.add.text(p.x, 602, 'Pulsa salto otra vez en el aire para el doble salto.', {
        ...TEXT_STYLE, fontSize: '23px', color: '#a9c1d5'
      }).setOrigin(0.5);
    });
  }

  createPowerUps() {
    this.add.text(960, 679, 'POTENCIADORES', {
      ...TEXT_STYLE, fontSize: '36px', fontFamily: FONT_DISPLAY, fontStyle: 'bold'
    }).setOrigin(0.5);
    POWERUPS.forEach((pu, i) => {
      const x = 340 + i * 620;
      createPanel(this, x, 820, 570, 210);
      fitImage(this, x - 223, 763, pu.key, 56, 56);
      this.add.text(x - 176, 763, pu.name, {
        ...TEXT_STYLE, fontSize: '28px', fontFamily: FONT_DISPLAY, fontStyle: 'bold', color: '#ffe19a'
      }).setOrigin(0, 0.5);
      this.add.text(x - 247, 808, pu.text, {
        ...TEXT_STYLE, fontSize: '25px', wordWrap: { width: 494 }, lineSpacing: 6
      });
    });
  }
}
