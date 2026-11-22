import { GAME_WIDTH } from '../config.js';
import { createButton, createBackdrop } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    this.scene.stop('PauseScene');
    this.scene.stop('GameScene');
    createBackdrop(this);
    audio.playMusic('menu');

    const title = this.add.image(GAME_WIDTH / 2, 200, 'art_logo');
    title.setScale(Math.min(1000 / title.width, 300 / title.height));
    this.tweens.add({ targets: title, y: 215, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const items = [
      ['Jugar (local)', () => this.scene.start('MapVoteScene'), true],
      ['Online (próximamente)', null, false],
      ['Controles', () => this.scene.start('ControlsScene'), true],
      ['Ajustes', () => this.scene.start('SettingsScene', { returnScene: 'MenuScene', escenaOrigen: null }), true],
      ['Créditos', () => this.scene.start('CreditsScene'), true]
    ];
    items.forEach(([label, onClick, enabled], i) => {
      createButton(this, GAME_WIDTH / 2, 430 + i * 125, label, onClick, enabled);
    });
  }
}
