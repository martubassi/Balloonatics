import { AUDIO } from '../config.js';

const STORAGE_KEY = 'balloonatics.audio';
const FILES = {
  hit: 'Balloon_Hit.wav', explosion: 'Balloon_Explosion.wav',
  countdown: 'Game_CountDown.wav', jump: 'Game_Jump.wav',
  hover: 'Menu_Hover.wav', select: 'Menu_Select.wav',
  dash: 'PowerUp_Dash.wav', heavy: 'PowerUp_Heavy.wav',
  pickup: 'PowerUp_PickUp.wav', slip: 'PowerUp_Slippery.wav'
};

const SFX = {
  hover:        { file: 'hover', channel: 'ui', volume: 0.35, rate: 1, spread: 0.04 },
  click:        { file: 'select', channel: 'ui', volume: 0.45, rate: 1, spread: 0.03 },
  back:         { file: 'select', channel: 'ui', volume: 0.38, rate: 0.8, spread: 0.02 },
  move:         { file: 'hover', channel: 'ui', volume: 0.3, rate: 0.9, spread: 0.04 },
  select:       { file: 'select', channel: 'ui', volume: 0.45, rate: 1.1, spread: 0.03 },
  confirm:      { file: 'pickup', channel: 'ui', volume: 0.45, rate: 1.15, spread: 0 },
  countdown:    { file: 'countdown', channel: 'sfx', volume: 0.45, rate: 1, spread: 0 },
  go:           { file: 'countdown', channel: 'sfx', volume: 0.55, rate: 1.35, spread: 0 },
  step:         { file: 'hit', channel: 'sfx', volume: 0.07, rate: 0.7, spread: 0.08 },
  jump:         { file: 'jump', channel: 'sfx', volume: 0.18, rate: 1, spread: 0.06 },
  airJump:      { file: 'jump', channel: 'sfx', volume: 0.15, rate: 1.22, spread: 0.05 },
  hit:          { file: 'hit', channel: 'sfx', volume: 0.55, rate: 1, spread: 0.05 },
  pickup_heavy: { file: 'pickup', channel: 'sfx', volume: 0.45, rate: 0.88, spread: 0.03 },
  pickup_dash:  { file: 'pickup', channel: 'sfx', volume: 0.45, rate: 1.12, spread: 0.03 },
  pickup_slip:  { file: 'pickup', channel: 'sfx', volume: 0.45, rate: 1.25, spread: 0.03 },
  heavyUse:     { file: 'heavy', channel: 'sfx', volume: 0.55, rate: 0.9, spread: 0.06 },
  dash:         { file: 'dash', channel: 'sfx', volume: 0.65, rate: 1, spread: 0.07 },
  slipUse:      { file: 'slip', channel: 'sfx', volume: 0.4, rate: 1, spread: 0.06 },
  loseLife:     { file: 'explosion', channel: 'sfx', volume: 0.5, rate: 1, spread: 0.04 },
  lose:         { file: 'explosion', channel: 'sfx', volume: 0.5, rate: 0.85, spread: 0.02 },
  win:          { file: 'pickup', channel: 'sfx', volume: 0.5, rate: 1.15, spread: 0 }
};

class AudioManager {
  constructor() {
    this.manager = null;
    this.music = null;
    this.musicName = null;
    this.volumes = { ...AUDIO.defaults };
    this.active = new Set();
    this.lastPlayed = {};
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      Object.keys(this.volumes).forEach(channel => {
        if (Number.isFinite(saved?.[channel])) {
          this.volumes[channel] = Math.min(Math.max(saved[channel], 0), 1);
        }
      });
    } catch {}
  }

  preload(scene) {
    Object.entries(FILES).forEach(([key, file]) => scene.load.audio(`sfx_${key}`, `assets/audio/${file}`));
    Object.entries(AUDIO.music).forEach(([name, file]) => {
      if (file) scene.load.audio(`music_${name}`, file);
    });
  }

  init(manager) { this.manager = manager; }

  unlock() {
    const context = this.manager?.context;
    if (context?.state === 'suspended') context.resume().catch(() => {});
  }

  getVolume(channel) { return this.volumes[channel]; }

  setVolume(channel, value) {
    if (!(channel in this.volumes) || !Number.isFinite(value)) return;
    this.volumes[channel] = Math.min(Math.max(Math.round(value * 100) / 100, 0), 1);
    if (channel === 'music' && this.music) this.music.setVolume(this.volumes.music * 0.35);
    this.active.forEach(entry => {
      if (entry.channel === channel) entry.sound.setVolume(entry.volume * this.volumes[channel]);
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.volumes)); } catch {}
  }

  playMusic(name) {
    if (this.musicName === name && this.music) return;
    this.stopMusic();
    if (!this.manager || !AUDIO.music[name] || !this.manager.game.cache.audio.exists(`music_${name}`)) return;
    this.musicName = name;
    this.music = this.manager.add(`music_${name}`);
    this.music.play({ loop: true, volume: this.volumes.music * 0.35 });
  }

  stopMusic() {
    if (this.music) this.music.destroy();
    this.music = null;
    this.musicName = null;
  }

  play(name, options = {}) {
    const effect = SFX[name];
    if (!effect || !this.manager) return;
    const now = performance.now();
    if (now - (this.lastPlayed[name] ?? -Infinity) < 40) return;
    this.lastPlayed[name] = now;

    // La velocidad cambia ligeramente el tono y la duración del archivo original.
    const variation = 1 + (Math.random() * 2 - 1) * effect.spread;
    const rate = Math.min(Math.max(effect.rate * (options.rate ?? 1) * variation, 0.5), 2);
    const sound = this.manager.add(`sfx_${effect.file}`);
    const entry = { sound, channel: effect.channel, volume: effect.volume };
    this.active.add(entry);
    sound.once('complete', () => sound.destroy());
    sound.once('destroy', () => this.active.delete(entry));
    if (!sound.play({ volume: effect.volume * this.volumes[effect.channel], rate }) && !this.manager.locked) sound.destroy();
  }
}

export const audio = new AudioManager();
