import { onSceneKey } from '../sceneInput.js';
import { FONT_DISPLAY } from '../typography.js';
import { createButton, createBackdrop, fitImage } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

export function resultPlacements(data) {
  const key = data.winnerKey || (data.ganador === 'Beto' ? 'beto' : 'pip');
  const other = key === 'pip' ? 'beto' : 'pip';
  return [
    { key, name: key === 'pip' ? 'Pip' : 'Beto', rank: 1, x: 740, top: 600, color: 0xf5c952 },
    { key: other, name: other === 'pip' ? 'Pip' : 'Beto', rank: 2, x: 1240, top: 700, color: 0x8ab4ce }
  ];
}

export class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  create(data) {
    createBackdrop(this, 0.88);
    audio.stopMusic();
    audio.play('win');
    this.placements = resultPlacements(data);
    this.createHeader(this.placements[0]);
    this.createConfetti();
    this.placements.forEach((player) => this.createPodium(player));
    createButton(this, 620, 995, 'Revancha', () => this.scene.start('MapVoteScene'), true, 48);
    createButton(this, 1300, 995, 'Menú principal', () => this.scene.start('MenuScene'), true, 48);
    onSceneKey(this, 'keydown-ESC', () => this.scene.start('MenuScene'));
  }

  createHeader(winner) {
    const glow = this.add.graphics();
    glow.fillStyle(0xffd866, 0.07).fillTriangle(740, 200, 350, 835, 1130, 835);
    glow.fillStyle(0x76def5, 0.035).fillTriangle(1240, 300, 1000, 835, 1480, 835);
    this.add.text(960, 102, '¡VICTORIA!', {
      fontFamily: FONT_DISPLAY, fontSize: '92px', fontStyle: 'bold', color: '#ffe18b',
      stroke: '#111a32', strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(960, 200, `${winner.name} supera el experimento`, {
      fontFamily: FONT_DISPLAY, fontSize: '34px', color: '#e2eff7'
    }).setOrigin(0.5);
  }

  createPodium(p) {
    const width = p.rank === 1 ? 350 : 290;
    const g = this.add.graphics();
    g.fillStyle(0x020813, 0.65).fillEllipse(p.x, 844, width + 60, 38);
    g.fillStyle(0x1b3452, 1).fillRoundedRect(p.x - width / 2, p.top, width, 830 - p.top, 12);
    g.lineStyle(4, p.color, 1).strokeRoundedRect(p.x - width / 2, p.top, width, 830 - p.top, 12);
    g.fillStyle(0x42658a, 1).fillEllipse(p.x, p.top + 3, width, 42);
    g.lineStyle(4, p.color, 1).strokeEllipse(p.x, p.top + 3, width, 42);
    this.add.text(p.x, p.top + (830 - p.top) / 2 + 8, String(p.rank), {
      fontFamily: FONT_DISPLAY, fontSize: p.rank === 1 ? '108px' : '78px', fontStyle: 'bold',
      color: p.rank === 1 ? '#ffe18b' : '#bdd7e7'
    }).setOrigin(0.5);
    const sprite = fitImage(this, p.x, p.top + 8, `art_${p.key}`, 210, 300).setOrigin(0.5, 1);
    if (p.rank === 1) {
      this.winnerSprite = sprite;
      this.tweens.add({
        targets: sprite, y: p.top - 16, duration: 380,
        ease: 'Sine.easeOut', yoyo: true, repeat: -1
      });
      this.tweens.add({
        targets: sprite, angle: { from: -7, to: 7 }, duration: 380,
        ease: 'Sine.easeInOut', yoyo: true, repeat: -1
      });
      this.createCrown(p.x);
    } else {
      sprite.setTint(0x94a8c1).setAngle(-5);
      this.loserSprite = sprite;
    }
    this.add.text(p.x, 890, `${p.rank}.º  ${p.name.toUpperCase()}`, {
      fontFamily: FONT_DISPLAY, fontSize: '42px', fontStyle: 'bold', color: p.rank === 1 ? '#ffe18b' : '#b4cee0'
    }).setOrigin(0.5);
  }

  createCrown(x) {
    const crown = this.add.graphics();
    crown.fillStyle(0xf5c518, 1).lineStyle(3, 0x6c491c, 1);
    crown.beginPath();
    crown.moveTo(x - 38, 280);
    crown.lineTo(x - 45, 243);
    crown.lineTo(x - 18, 258);
    crown.lineTo(x, 230);
    crown.lineTo(x + 18, 258);
    crown.lineTo(x + 45, 243);
    crown.lineTo(x + 38, 280);
    crown.closePath();
    crown.fillPath();
    crown.strokePath();
  }

  createConfetti() {
    const colors = [0xf5c518, 0xe94560, 0x65dfff, 0xa88af3, 0xffffff];
    for (let i = 0; i < 64; i++) {
      const x = Phaser.Math.Between(200, 1720);
      const bit = this.add.rectangle(x, Phaser.Math.Between(-700, -20), 7, 14, colors[i % colors.length]);
      this.tweens.add({
        targets: bit, y: 930, x: x + Phaser.Math.Between(-120, 120), angle: 360,
        duration: Phaser.Math.Between(2500, 4200), delay: i * 32, repeat: -1, ease: 'Linear'
      });
    }
  }
}
