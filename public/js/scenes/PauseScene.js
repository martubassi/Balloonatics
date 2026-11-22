import { FONT_DISPLAY } from '../typography.js';
import { createButton, createWindow } from '../ui.js';
import { audio } from '../systems/AudioManager.js';
import { onSceneKey } from '../sceneInput.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }

  create(data = {}) {
    const origin = data.escenaOrigen || 'GameScene';
    if (origin !== 'GameScene' || !this.scene.isPaused(origin)) {
      this.scene.start('MenuScene', {});
      return;
    }
    this.add.rectangle(960, 540, 1920, 1080, 0x040919, 0.82);
    const { at } = createWindow(this, 'PAUSA', 1120, 515);
    const row = (fraction) => at(0.5, fraction).y;
    this.add.text(960, 343, 'El experimento puede esperar.', {
      fontFamily: 'Arial', fontSize: '30px', color: '#bfdce9'
    }).setOrigin(0.5);
    const resume = () => {
      audio.play('back');
      if (!this.scene.isPaused(origin)) {
        this.scene.start('MenuScene', {});
        return;
      }
      this.scene.stop();
      this.scene.resume(origin);
    };
    createButton(this, 960, row(0.39), 'Continuar', resume, true, 48);
    createButton(this, 960, row(0.56), 'Ajustes', () => this.scene.start('SettingsScene', {
      returnScene: 'PauseScene', escenaOrigen: origin
    }), true, 48);
    createButton(this, 960, row(0.73), 'Menú principal', () => {
      this.scene.stop(origin);
      this.scene.start('MenuScene');
    }, true, 48);
    this.add.text(960, 915, 'ESC · CONTINUAR', {
      fontFamily: FONT_DISPLAY, fontSize: '26px', color: '#a7c6d9'
    }).setOrigin(0.5);
    onSceneKey(this, 'keydown-ESC', resume);
  }
}
