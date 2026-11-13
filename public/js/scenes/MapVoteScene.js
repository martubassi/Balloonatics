import { GAME_WIDTH, FLOOR_TOP, FLOOR_HEIGHT, PLATFORM_HEIGHT } from '../config.js';
import { MAPS, getMap, resolveMapVote } from '../maps.js';

const CARD = { w: 480, h: 270, y: 450, gap: 120 };

export class MapVoteScene extends Phaser.Scene {
  constructor() { super('MapVoteScene'); }

  create() {
    this.resolved = false;

    this.add.text(GAME_WIDTH / 2, 110, 'ELIGE EL MAPA', {
      fontFamily: 'Arial', fontSize: '100px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 10
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 200,
      'J1: A/D mover · W votar · S cambiar        J2: ←/→ mover · ↑ votar · ↓ cambiar', {
        fontFamily: 'Arial', fontSize: '32px', color: '#9aa0c8'
      }).setOrigin(0.5);

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
      p.frame = this.add.rectangle(this.cardX[p.cursor], CARD.y, CARD.w + p.pad, CARD.h + p.pad)
        .setStrokeStyle(10, p.color);
      p.status = this.add.text(p.statusX, 800, '', {
        fontFamily: 'Arial', fontSize: '44px', fontStyle: 'bold', color: p.hex
      }).setOrigin(0.5);
      this.refresh(p);
    });

    kb.once('keydown-ESC', () => this.scene.start('MenuScene'));
  }

  // Miniatura del mapa a escala (la arena es 1920x1080, la tarjeta 480x270)
  drawCard(map, cx) {
    const s = CARD.w / GAME_WIDTH;
    const left = cx - CARD.w / 2;
    const top = CARD.y - CARD.h / 2;
    const g = this.add.graphics();
    g.fillStyle(map.background, 1).fillRect(left, top, CARD.w, CARD.h);
    g.fillStyle(map.platformColor, 1);
    map.platforms.forEach(([x, y, w]) => {
      g.fillRect(left + (x - w / 2) * s, top + y * s, w * s, Math.max(PLATFORM_HEIGHT * s, 4));
    });
    g.fillRect(left, top + FLOOR_TOP * s, CARD.w, FLOOR_HEIGHT * s);
    g.lineStyle(4, 0x000000, 1).strokeRect(left, top, CARD.w, CARD.h);

    this.add.text(cx, CARD.y + CARD.h / 2 + 45, map.name, {
      fontFamily: 'Arial', fontSize: '56px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);
  }

  refresh(p) {
    p.frame.setPosition(this.cardX[p.cursor], CARD.y).setAlpha(p.vote === null ? 0.55 : 1);
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
        if (left) p.cursor = (p.cursor + MAPS.length - 1) % MAPS.length;
        if (right) p.cursor = (p.cursor + 1) % MAPS.length;
        if (up) p.vote = MAPS[p.cursor].id;
      } else if (down) {
        p.vote = null;
      }
      this.refresh(p);
    });

    if (this.players.every((p) => p.vote !== null)) this.resolve();
  }

  resolve() {
    this.resolved = true;
    const [a, b] = this.players;
    const { mapId, random } = resolveMapVote(a.vote, b.vote);
    const name = getMap(mapId).name;

    const msg = random
      ? `${a.name}: ${getMap(a.vote).name}  ·  ${b.name}: ${getMap(b.vote).name}\n¡Sorteo! Sale ${name}`
      : `¡Mapa elegido: ${name}!`;
    this.add.text(GAME_WIDTH / 2, 940, msg, {
      fontFamily: 'Arial', fontSize: '52px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#000000', strokeThickness: 6, align: 'center'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => this.scene.start('GameScene', { mapId }));
  }
}
