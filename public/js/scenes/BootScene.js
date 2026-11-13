import { COLORS } from '../config.js';
import { MAPS } from '../maps.js';

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
    MAPS.forEach((m) => box(`platform_${m.id}`, 64, 30, m.platformColor, 6)); // plataformas de cada mapa

    g.clear();
    g.fillStyle(COLORS.balloon, 1).fillCircle(40, 40, 37);
    g.lineStyle(6, 0x000000, 1).strokeCircle(40, 40, 37);
    g.generateTexture('balloon', 80, 80);

    // Cajas de potenciador (caja amarilla + símbolo)
    const powerBox = (key, drawSymbol) => {
      g.clear();
      g.fillStyle(COLORS.balloon, 1).fillRoundedRect(0, 0, 64, 64, 12);
      g.lineStyle(6, 0x000000, 1).strokeRoundedRect(3, 3, 58, 58, 12);
      drawSymbol(g);
      g.generateTexture(key, 64, 64);
    };
    powerBox('pu_heavy', (s) => { s.fillStyle(0x000000, 1); s.fillRoundedRect(16, 28, 32, 22, 6); s.fillRect(27, 14, 10, 14); });
    powerBox('pu_dash', (s) => { s.fillStyle(0x000000, 1); s.fillTriangle(14, 18, 14, 46, 32, 32); s.fillTriangle(32, 18, 32, 46, 50, 32); });
    powerBox('pu_slip', (s) => { s.fillStyle(COLORS.beto, 1); s.fillTriangle(32, 12, 50, 32, 32, 52); s.fillTriangle(32, 12, 14, 32, 32, 52); });

    g.destroy();
    this.scene.start('MenuScene');
  }
}
