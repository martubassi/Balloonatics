import { audio } from './systems/AudioManager.js';
import { FONT_DISPLAY } from './typography.js';

export function createBackdrop(scene, opacity = 0.78) {
  scene.add.image(960, 540, 'art_background_clasico').setDisplaySize(1920, 1080);
  scene.add.rectangle(960, 540, 1920, 1080, 0x080e25, opacity);
}

export function createPanel(scene, x, y, width, height, key = 'plain') {
  return scene.add.nineslice(x, y, key === 'key' ? 'ui_key' : 'ui_panel', undefined,
    width, height, 20, 20, 20, 20);
}

export function fitImage(scene, x, y, texture, width, height) {
  const image = scene.add.image(x, y, texture);
  return image.setScale(Math.min(width / image.width, height / image.height));
}

export function createWindow(scene, title, width = 1440, cy = 510) {
  const frame = fitImage(scene, 960, cy, 'art_frame_hd', width, 930);
  const left = frame.x - frame.displayWidth / 2;
  const top = frame.y - frame.displayHeight / 2;
  const at = (u, v) => ({ x: left + frame.displayWidth * u, y: top + frame.displayHeight * v });
  const heading = at(0.5, 0.095);
  scene.add.text(heading.x, heading.y, title, {
    fontFamily: FONT_DISPLAY, fontSize: '58px', fontStyle: 'bold', color: '#edf8ff',
    stroke: '#17324e', strokeThickness: 3
  }).setOrigin(0.5);
  return { frame, at };
}

export function createButton(scene, x, y, label, onClick, enabled = true, fontSize = 64) {
  const btn = scene.add.text(x, y, label, {
    fontFamily: FONT_DISPLAY, fontSize: `${fontSize}px`, fontStyle: 'bold',
    color: enabled ? '#ffffff' : '#8a9bb3',
    stroke: '#101c35', strokeThickness: 4,
    padding: { x: 40, y: 16 }
  }).setOrigin(0.5);
  const plate = scene.add.nineslice(x, y, 'ui_button', undefined,
    Math.max(480, btn.width + 48), Math.max(96, btn.height + 12), 20, 20, 20, 20).setAlpha(enabled ? 1 : 0.45);
  scene.children.moveBelow(plate, btn);

  if (enabled) {
    plate.setInteractive({ useHandCursor: true });
    plate.on('pointerover', () => { btn.setColor('#a1f5ff'); plate.setTint(0xa1f5ff); audio.play('hover'); });
    plate.on('pointerout', () => { btn.setColor('#ffffff'); plate.clearTint(); });
    plate.on('pointerdown', () => { audio.play('click'); onClick(); });
  }
  return btn;
}
