import { COLORS } from '../config.js';

// Genera texturas placeholder (sin assets) con la paleta del GDD
export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    const g = this.add.graphics();

    const box = (key, w, h, color, radius) => {
      g.clear();
      g.fillStyle(color, 1).fillRoundedRect(0, 0, w, h, radius);
      g.lineStyle(6, 0x000000, 1).strokeRoundedRect(3, 3, w - 6, h - 6, radius);
      g.generateTexture(key, w, h);
    };
    box('pip', 64, 96, COLORS.pip, 14);
    box('beto', 64, 96, COLORS.beto, 14);
    box('platform', 64, 30, COLORS.platform, 6);

    g.clear();
    g.fillStyle(COLORS.balloon, 1).fillCircle(40, 40, 37);
    g.lineStyle(6, 0x000000, 1).strokeCircle(40, 40, 37);
    g.generateTexture('balloon', 80, 80);

    g.destroy();
    this.scene.start('MenuScene');
  }
}
