import { GAME_WIDTH } from '../config.js';
import { createButton } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    audio.playMusic('menu');

    const title = this.add.text(GAME_WIDTH / 2, 200, 'BALLOONATICS', {
      fontFamily: 'Arial', fontSize: '160px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 12
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, y: 215, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Botones apilados con el mismo espaciado
    const items = [
      ['Jugar (local)', () => this.scene.start('MapVoteScene'), true],
      ['Online (próximamente)', null, false],
      ['Controles', () => this.scene.start('ControlsScene'), true],
      ['Ajustes', () => this.scene.start('SettingsScene'), true],
      ['Créditos', () => this.scene.start('CreditsScene'), true]
    ];
    items.forEach(([label, onClick, enabled], i) => {
      createButton(this, GAME_WIDTH / 2, 430 + i * 125, label, onClick, enabled);
    });
  }
}
