import { GAME_WIDTH } from '../config.js';
import { createButton } from '../ui.js';
import { audio } from '../systems/AudioManager.js';

const ROWS = [
  { channel: 'music', label: 'Música', preview: null },
  { channel: 'sfx', label: 'Efectos', preview: 'jump' },
  { channel: 'ui', label: 'Botones', preview: 'click' }
];
const SLIDER = { x: 760, w: 700, y0: 400, gap: 150 };

export class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }

  create() {
    audio.playMusic('menu');
    this.dragging = null;
    this.selected = 0;

    this.add.text(GAME_WIDTH / 2, 160, 'AJUSTES', {
      fontFamily: 'Arial', fontSize: '120px', fontStyle: 'bold', color: '#F5C518',
      stroke: '#000000', strokeThickness: 10
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 270, 'Arrastra con el ratón · o usa ↑/↓ para elegir y ←/→ para ajustar', {
      fontFamily: 'Arial', fontSize: '32px', color: '#9aa0c8'
    }).setOrigin(0.5);

    this.sliders = ROWS.map((row, i) => this.createSlider(row, SLIDER.y0 + i * SLIDER.gap, i));
    this.select(0);

    this.input.on('pointermove', (p) => { if (this.dragging) this.dragging.setFromPointer(p.x); });
    this.input.on('pointerup', () => this.endDrag());
    this.input.on('gameout', () => this.endDrag());

    this.input.keyboard.on('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.select((this.selected + ROWS.length - 1) % ROWS.length);
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.select((this.selected + 1) % ROWS.length);
      const dir = (['ArrowRight', 'KeyD'].includes(e.code) ? 1 : 0) - (['ArrowLeft', 'KeyA'].includes(e.code) ? 1 : 0);
      if (dir !== 0) {
        const s = this.sliders[this.selected];
        audio.setVolume(s.channel, audio.getVolume(s.channel) + dir * 0.05);
        s.refresh();
        if (s.preview) audio.play(s.preview);
      }
    });
    this.input.keyboard.once('keydown-ESC', () => { audio.play('back'); this.scene.start('MenuScene'); });

    createButton(this, GAME_WIDTH / 2, 900, 'Volver', () => this.scene.start('MenuScene'));
  }

  createSlider({ channel, label, preview }, y, index) {
    const { x, w } = SLIDER;
    const labelText = this.add.text(x - 60, y, label, {
      fontFamily: 'Arial', fontSize: '56px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(1, 0.5);
    this.add.rectangle(x, y, w, 18, 0x2a2f55).setOrigin(0, 0.5);
    const fill = this.add.rectangle(x, y, w, 18, 0xF5C518).setOrigin(0, 0.5);
    const knob = this.add.circle(x, y, 32, 0xffffff).setStrokeStyle(6, 0x000000);
    const pct = this.add.text(x + w + 60, y, '', {
      fontFamily: 'Arial', fontSize: '48px', fontStyle: 'bold', color: '#9aa0c8'
    }).setOrigin(0, 0.5);

    const slider = {
      channel, preview, labelText,
      refresh: () => {
        const v = audio.getVolume(channel);
        fill.width = w * v;
        knob.x = x + w * v;
        pct.setText(`${Math.round(v * 100)}%`);
      },
      setFromPointer: (px) => {
        audio.setVolume(channel, Phaser.Math.Clamp((px - x) / w, 0, 1));
        slider.refresh();
      }
    };
    slider.refresh();

    // Zona de ratón (invisible) un poco más grande que la barra
    const hit = this.add.rectangle(x + w / 2, y, w + 80, 90, 0x000000, 0).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (p) => {
      this.dragging = slider;
      this.select(index);
      slider.setFromPointer(p.x);
    });
    return slider;
  }

  select(i) {
    this.selected = i;
    this.sliders.forEach((s, j) => s.labelText.setColor(j === i ? '#F5C518' : '#ffffff'));
  }

  // Al soltar suena una muestra del canal para oír el volumen elegido
  endDrag() {
    if (!this.dragging) return;
    if (this.dragging.preview) audio.play(this.dragging.preview);
    this.dragging = null;
  }
}
