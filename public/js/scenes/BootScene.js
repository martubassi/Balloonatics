import { audio } from '../systems/AudioManager.js';
import { preloadArtwork, fitTexture } from '../assets.js';
import { MAPS } from '../maps.js';
import { createUiTextures } from '../uiTextures.js';
import { preparePlatformFrames } from '../arenaVisuals.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    this.loadingText = this.add.text(960, 540, 'Cargando laboratorio…', {
      fontFamily: 'Arial', fontSize: '42px', color: '#a4f3ff'
    }).setOrigin(0.5);
    this.load.on('progress', n => this.loadingText.setText(`Cargando laboratorio… ${Math.round(n * 100)}%`));
    this.failedAssets = [];
    this.load.on('loaderror', file => {
      if (file.key.startsWith('music_')) console.warn('Pista de música no disponible:', file.key);
      else this.failedAssets.push(file.key);
    });
    preloadArtwork(this);
    audio.preload(this);
  }

  create() {
    if (this.failedAssets.length) {
      this.loadingText.setText('No se han podido cargar los recursos. Recarga la página.');
      console.error('Recursos no encontrados:', this.failedAssets);
      return;
    }
    audio.init(this.sound);
    fitTexture(this, 'pip', 64, 96);
    fitTexture(this, 'beto', 64, 96);
    fitTexture(this, 'balloon', 80, 80, true);
    MAPS.forEach((map) => {
      const image = this.textures.get(`art_platform_${map.id}`).getSourceImage();
      fitTexture(this, `platform_${map.id}`, Math.round(image.width * 30 / image.height), 30);
      preparePlatformFrames(this, map.id);
    });
    createUiTextures(this);
    this.createPowerUpTextures();
    this.scene.start('MenuScene');
  }

  createPowerUpTextures() {
    for (const kind of ['heavy', 'dash', 'slip']) {
      const texture = this.textures.createCanvas(`pu_${kind}`, 64, 64);
      const ctx = texture.context;
      ctx.drawImage(this.textures.get('art_crate').getSourceImage(), 0, 0, 64, 64);
      ctx.fillStyle = '#14213d';
      ctx.fillRect(12, 12, 40, 40);
      ctx.fillStyle = kind === 'slip' ? '#64e9ff' : '#fff1ab';
      if (kind === 'heavy') {
        ctx.fillRect(21, 29, 22, 17);
        ctx.fillRect(28, 19, 8, 12);
      } else if (kind === 'dash') {
        ctx.beginPath();
        ctx.moveTo(33, 17);
        ctx.lineTo(22, 34);
        ctx.lineTo(31, 34);
        ctx.lineTo(27, 49);
        ctx.lineTo(44, 28);
        ctx.lineTo(34, 28);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(32, 17);
        ctx.quadraticCurveTo(11, 43, 32, 48);
        ctx.quadraticCurveTo(53, 43, 32, 17);
        ctx.fill();
      }
      texture.refresh();
    }
  }
}
