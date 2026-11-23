import { onSceneKey } from '../sceneInput.js';
import { FONT_DISPLAY } from '../typography.js';
import { GAME_WIDTH, FLOOR_TOP, FLOOR_HEIGHT } from '../config.js';
import { MAPS, getMap, resolveMapVote } from '../maps.js';
import { audio } from '../systems/AudioManager.js';

import { createBackdrop, createPanel } from '../ui.js';
import { drawArenaBackground, drawPlatform } from '../arenaVisuals.js';

export const MAP_CARD_LAYOUT = { w: 480, h: 270, y: 490, gap: 120, footer: 112, titleGap: 30 };
const CARD = MAP_CARD_LAYOUT;

export class MapVoteScene extends Phaser.Scene {
  constructor() { super('MapVoteScene'); }

  create() {
    audio.playMusic('menu');
    createBackdrop(this);
    this.resolved = false;

    this.add.text(GAME_WIDTH / 2, 110, 'ELIGE EL MAPA', {
      fontFamily: FONT_DISPLAY, fontSize: '82px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 10
    }).setOrigin(0.5);
    [
      { x: 500, name: 'PIP · J1', color: '#ff8297', keys: 'A / D: mover   W: votar   S: cambiar voto' },
      { x: 1420, name: 'BETO · J2', color: '#7ce7ff', keys: '\u2190 / \u2192: mover   \u2191: votar   \u2193: cambiar voto' }
    ].forEach(p => {
      createPanel(this, p.x, 238, 840, 128);
      this.add.text(p.x, 211, p.name, {
        fontFamily: FONT_DISPLAY, fontSize: '28px', fontStyle: 'bold', color: p.color
      }).setOrigin(0.5);
      this.add.text(p.x, 261, p.keys, {
        fontFamily: 'Arial', fontSize: '32px', color: '#ffffff'
      }).setOrigin(0.5);
    });

    const start = GAME_WIDTH / 2 - ((MAPS.length - 1) * (CARD.w + CARD.gap)) / 2;
    this.cardX = MAPS.map((_, i) => start + i * (CARD.w + CARD.gap));
    MAPS.forEach((map, i) => this.drawCard(map, this.cardX[i]));

    const kb = this.input.keyboard;
    this.players = [
      { name: 'Pip', color: 0xE94560, hex: '#E94560', pad: 24, statusX: 480, cursor: 0, vote: null,
        keys: kb.addKeys({ left: 'A', right: 'D', up: 'W', down: 'S' }) },
      { name: 'Beto', color: 0x0F9BD7, hex: '#0F9BD7', pad: 48, statusX: 1440, cursor: MAPS.length - 1, vote: null,
        keys: kb.createCursorKeys() }
    ];
    this.players.forEach((p) => {
      p.frame = this.add.rectangle(this.cardX[p.cursor], CARD.y + CARD.footer / 2,
        CARD.w + 40 + p.pad, CARD.h + CARD.footer + 40 + p.pad)
        .setStrokeStyle(6, p.color);
      p.status = this.add.text(p.statusX, 850, '', {
        fontFamily: FONT_DISPLAY, fontSize: '44px', fontStyle: 'bold', color: p.hex
      }).setOrigin(0.5);
      this.refresh(p);
    });

    onSceneKey(this, 'keydown-ESC', () => this.scene.start('MenuScene'));
  }

  drawCard(map, cx) {
    const s = CARD.w / GAME_WIDTH;
    const left = cx - CARD.w / 2;
    const top = CARD.y - CARD.h / 2;
    createPanel(this, cx, CARD.y + CARD.footer / 2, CARD.w + 40, CARD.h + CARD.footer + 40);
    drawArenaBackground(this, map, CARD.w, CARD.h, cx, CARD.y);
    const g = this.add.graphics();

    g.fillStyle(map.platformColor, 1);
    map.platforms.forEach(([x, y, w]) => {
      drawPlatform(this, map.id, left + x * s, top + y * s, w * s, s);
    });
    g.fillRect(left, top + FLOOR_TOP * s, CARD.w, FLOOR_HEIGHT * s);
    g.lineStyle(4, 0x000000, 1).strokeRect(left, top, CARD.w, CARD.h);

    this.add.text(cx, CARD.y + CARD.h / 2 + CARD.titleGap, map.name, {
      fontFamily: FONT_DISPLAY, fontSize: '48px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#091324', strokeThickness: 3
    }).setOrigin(0.5, 0);
  }

  refresh(p) {
    p.frame.setPosition(this.cardX[p.cursor], CARD.y + CARD.footer / 2).setAlpha(p.vote === null ? 0.55 : 1);
    p.status.setText(p.vote === null ? `${p.name}: eligiendo…` : `${p.name}: ✓ ${getMap(p.vote).name}`);
  }

  update() {
    if (this.resolved) return;
    const justDown = Phaser.Input.Keyboard.JustDown;

    this.players.forEach((p) => {
      const left = justDown(p.keys.left);
      const right = justDown(p.keys.right);
      const up = justDown(p.keys.up);
      const down = justDown(p.keys.down);

      if (p.vote === null) {
        if (left) { p.cursor = (p.cursor + MAPS.length - 1) % MAPS.length; audio.play('move'); }
        if (right) { p.cursor = (p.cursor + 1) % MAPS.length; audio.play('move'); }
        if (up) { p.vote = MAPS[p.cursor].id; audio.play('select'); }
      } else if (down) {
        p.vote = null;
        audio.play('back');
      }
      this.refresh(p);
    });

    if (this.players.every((p) => p.vote !== null)) this.resolve();
  }

  resolve() {
    this.resolved = true;
    audio.play('confirm');
    const [a, b] = this.players;
    const { mapId, random } = resolveMapVote(a.vote, b.vote);
    const name = getMap(mapId).name;

    const msg = random
      ? `${a.name}: ${getMap(a.vote).name}  ·  ${b.name}: ${getMap(b.vote).name}\n¡Sorteo! Sale ${name}`
      : `¡Mapa elegido: ${name}!`;
    this.add.text(GAME_WIDTH / 2, 970, msg, {
      fontFamily: FONT_DISPLAY, fontSize: '44px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#000000', strokeThickness: 6, align: 'center'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => this.scene.start('GameScene', { mapId }));
  }
}
