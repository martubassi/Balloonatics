import { FONT_DISPLAY } from '../typography.js';
import { GAME_WIDTH } from '../config.js';
import { createButton, createBackdrop, fitImage, createWindow } from '../ui.js';
import { audio } from '../systems/AudioManager.js';
import { onSceneKey } from '../sceneInput.js';

const ROWS = [
  { channel: 'music', label: 'Música', preview: null },
  { channel: 'sfx', label: 'Efectos', preview: 'jump' },
  { channel: 'ui', label: 'Botones', preview: 'click' }
];
const SLIDER = { x: 780, w: 520, y0: 400, gap: 160 };

export class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }

  init(data) {
    // Phaser conserva los datos de la última apertura si no se envían otros.
    const fromPause = data?.returnScene === 'PauseScene'
      && data?.escenaOrigen === 'GameScene' && this.scene.isPaused('GameScene');
    this.returnScene = fromPause ? 'PauseScene' : 'MenuScene';
    this.origin = fromPause ? 'GameScene' : null;
  }

  goBack() {
    audio.play('back');
    if (this.returnScene === 'PauseScene' && this.scene.isPaused(this.origin)) {
      this.scene.start('PauseScene', { escenaOrigen: this.origin });
    } else {
      this.scene.start('MenuScene', {});
    }
  }

  create() {
    createBackdrop(this, 0.84);
    this.windowLayout = createWindow(this, 'AJUSTES', 1440, 510);
    audio.playMusic('menu');
    this.dragging = null;
    this.selected = 0;

    this.add.text(GAME_WIDTH / 2, 270, 'Arrastra los controles o usa flechas: arriba/abajo para elegir, izquierda/derecha para ajustar.', {
      fontFamily: 'Arial', fontSize: '24px', color: '#b8cede'
    }).setOrigin(0.5);

    this.sliders = ROWS.map((row, i) => this.createSlider(row, SLIDER.y0 + i * SLIDER.gap, i));
    this.select(0);

    this.input.on('pointermove', (p) => { if (this.dragging) this.dragging.setFromPointer(p.x); });
    this.input.on('pointerup', () => this.endDrag());
    this.input.on('gameout', () => this.endDrag());

    const adjustVolume = (e) => {
      if (!this.sys.isActive()) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.select((this.selected + ROWS.length - 1) % ROWS.length);
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.select((this.selected + 1) % ROWS.length);
      const dir = (['ArrowRight', 'KeyD'].includes(e.code) ? 1 : 0) - (['ArrowLeft', 'KeyA'].includes(e.code) ? 1 : 0);
      if (dir !== 0) {
        const s = this.sliders[this.selected];
        audio.setVolume(s.channel, audio.getVolume(s.channel) + dir * 0.05);
        s.refresh();
        if (s.preview) audio.play(s.preview);
      }
    };
    this.input.keyboard.on('keydown', adjustVolume);
    this.events.once('shutdown', () => this.input.keyboard.off('keydown', adjustVolume));
    onSceneKey(this, 'keydown-ESC', () => this.goBack());

    this.add.text(960, 800, 'Los cambios se guardan automáticamente.', {
      fontFamily: 'Arial', fontSize: '24px', color: '#a8c5d9'
    }).setOrigin(0.5);
    createButton(this, GAME_WIDTH / 2, 995, 'Volver', () => this.goBack(), true, 48);
  }

  createSlider({ channel, label, preview }, y, index) {
    const { x, w } = SLIDER;
    const labelText = this.add.text(445, y, label, {
      fontFamily: FONT_DISPLAY, fontSize: '42px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0, 0.5);
    const bezel = this.add.graphics();
    bezel.fillStyle(0x101d35, 1).fillRoundedRect(x - 22, y - 33, w + 44, 66, 30);
    bezel.lineStyle(4, 0x779fc1, 1).strokeRoundedRect(x - 22, y - 33, w + 44, 66, 30);
    bezel.fillStyle(0x33587c, 1).fillRoundedRect(x - 15, y - 26, w + 30, 52, 24);
    bezel.fillStyle(0x080f27, 1).fillRoundedRect(x - 2, y - 14, w + 4, 28, 14);
    const fill = this.add.graphics();
    const knob = fitImage(this, x, y, 'ui_knob', 64, 64);
    const pct = this.add.text(1460, y, '', {
      fontFamily: FONT_DISPLAY, fontSize: '38px', fontStyle: 'bold', color: '#bcd6e9'
    }).setOrigin(1, 0.5);

    const slider = {
      channel, preview, labelText,
      refresh: () => {
        const v = audio.getVolume(channel);
        const filled = w * v;
        fill.clear();
        if (filled > 0) fill.fillStyle(0x65efff, 1).fillRoundedRect(x, y - 6, filled, 12, Math.min(6, filled / 2));
        knob.x = x + w * v;
        pct.setText(`${Math.round(v * 100)}%`);
      },
      setFromPointer: (px) => {
        audio.setVolume(channel, Phaser.Math.Clamp((px - x) / w, 0, 1));
        slider.refresh();
      }
    };
    slider.refresh();

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

  endDrag() {
    if (!this.dragging) return;
    if (this.dragging.preview) audio.play(this.dragging.preview);
    this.dragging = null;
  }
}
