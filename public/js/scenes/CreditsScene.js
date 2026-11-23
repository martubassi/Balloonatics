import { onSceneKey } from '../sceneInput.js';
import { FONT_DISPLAY } from '../typography.js';
import { CREDITS } from '../config.js';
import { createButton, createBackdrop, createPanel, createWindow } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

export class CreditsScene extends Phaser.Scene {
  constructor() { super('CreditsScene'); }

  create() {
    createBackdrop(this, 0.86);
    createWindow(this, 'CRÉDITOS', 1480, 500);
    this.createTeam();
    this.createFooter();
    createButton(this, 960, 995, 'Volver', () => this.scene.start('MenuScene'), true, 48);
    onSceneKey(this, 'keydown-ESC', () => {
      audio.play('back');
      this.scene.start('MenuScene');
    });
  }

  createTeam() {
    this.add.text(960, 242, 'UN JUEGO DEL EQUIPO COMPAÑÍA LEGÍTIMA', {
      fontFamily: 'Arial', fontSize: '26px', color: '#a9d9ec'
    }).setOrigin(0.5);
    CREDITS.forEach((member, i) => {
      const x = i % 2 ? 1280 : 640;
      const y = 370 + Math.floor(i / 2) * 205;
      createPanel(this, x, y, 570, 158);
      const name = this.add.text(x, y - 20, member.name, {
        fontFamily: FONT_DISPLAY, fontSize: '34px', fontStyle: 'bold', color: '#f3f8ff'
      }).setOrigin(0.5);
      if (name.width > 508) name.setFontSize(Math.floor(34 * 508 / name.width));
      this.add.text(x, y + 35, member.role, {
        fontFamily: 'Arial', fontSize: '25px', color: '#9fbed3'
      }).setOrigin(0.5);
    });
  }

  createFooter() {
    this.add.text(960, 754, 'Diseño y desarrollo de videojuegos · Universidad Rey Juan Carlos', {
      fontFamily: 'Arial', fontSize: '27px', color: '#c5dceb'
    }).setOrigin(0.5);
    this.add.text(960, 803, 'Desarrollado con Phaser 3  ·  Tipografía Tektur, de Adam Jagosz', {
      fontFamily: 'Arial', fontSize: '23px', color: '#93aec6'
    }).setOrigin(0.5);
  }
}
