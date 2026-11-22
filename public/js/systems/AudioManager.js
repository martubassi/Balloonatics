import { AUDIO } from '../config.js';

// Sistema de sonido 100% sintetizado con Web Audio (sin assets).
// Tres canales con su propio volumen: music, sfx (efectos del juego) y ui (botones).
// Uso: audio.play('hit'), audio.playMusic('game'), audio.setVolume('music', 0.5)

const STORAGE_KEY = 'balloonatics.audio';
const CHANNEL_BASE = { music: 0.35, sfx: 0.7, ui: 0.6 }; // ganancia máxima de cada canal
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// ---------- Música: bucle de 4 compases (Am - F - C - G) en corcheas ----------
const CHORDS = [
  [45, [0, 3, 7, 12]], // La menor
  [41, [0, 4, 7, 12]], // Fa mayor
  [48, [0, 4, 7, 12]], // Do mayor
  [43, [0, 4, 7, 12]]  // Sol mayor
];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
const SONGS = {
  menu: { bpm: 92, drums: false, arpVol: 0.07, bassVol: 0.16 },
  game: { bpm: 136, drums: true, arpVol: 0.09, bassVol: 0.2 }
};

// ---------- Efectos: cada uno dibuja sus tonos/ruido en (dest, t) ----------
const SFX = {
  // Botones y menús (canal "ui")
  hover:   { ch: 'ui', fn: (m, d, t) => m.tone(d, { freq: 900, dur: 0.05, vol: 0.15, when: t }) },
  click:   { ch: 'ui', fn: (m, d, t) => m.tone(d, { freq: 500, slideTo: 900, dur: 0.09, type: 'square', vol: 0.18, when: t }) },
  back:    { ch: 'ui', fn: (m, d, t) => m.tone(d, { freq: 700, slideTo: 350, dur: 0.1, type: 'square', vol: 0.16, when: t }) },
  move:    { ch: 'ui', fn: (m, d, t) => m.tone(d, { freq: 660, dur: 0.04, vol: 0.12, when: t }) },
  select:  { ch: 'ui', fn: (m, d, t) => { m.tone(d, { freq: 660, dur: 0.08, type: 'square', vol: 0.15, when: t }); m.tone(d, { freq: 990, dur: 0.12, type: 'square', vol: 0.15, when: t + 0.07 }); } },
  confirm: { ch: 'ui', fn: (m, d, t) => [523, 659, 784].forEach((f, i) => m.tone(d, { freq: f, dur: 0.12, type: 'square', vol: 0.16, when: t + i * 0.08 })) },

  // Partida (canal "sfx")
  countdown: { ch: 'sfx', fn: (m, d, t) => m.tone(d, { freq: 660, dur: 0.12, type: 'square', vol: 0.2, when: t }) },
  go:        { ch: 'sfx', fn: (m, d, t) => { m.tone(d, { freq: 880, slideTo: 1320, dur: 0.3, type: 'square', vol: 0.22, when: t }); m.tone(d, { freq: 440, dur: 0.3, type: 'triangle', vol: 0.25, when: t }); } },
  step:      { ch: 'sfx', fn: (m, d, t) => { m.noise(d, { dur: 0.05, vol: 0.07, hp: 900, when: t }); m.tone(d, { freq: 90, dur: 0.05, type: 'triangle', vol: 0.1, when: t }); } },
  jump:      { ch: 'sfx', fn: (m, d, t) => m.tone(d, { freq: 280, slideTo: 560, dur: 0.16, vol: 0.3, when: t }) },
  airJump:   { ch: 'sfx', fn: (m, d, t) => m.tone(d, { freq: 420, slideTo: 900, dur: 0.16, type: 'triangle', vol: 0.3, when: t }) },
  // Golpe al globo: el tono sube con la velocidad (opts.rate)
  hit: { ch: 'sfx', fn: (m, d, t, o) => {
    const r = o.rate || 1;
    m.tone(d, { freq: 520 * r, slideTo: 180 * r, dur: 0.18, type: 'triangle', vol: 0.4, when: t });
    m.tone(d, { freq: 1040 * r, dur: 0.06, vol: 0.15, when: t });
    m.noise(d, { dur: 0.06, vol: 0.25, hp: 1200, when: t });
  } },

  // Recoger potenciador: uno distinto para cada uno
  pickup_heavy: { ch: 'sfx', fn: (m, d, t) => { m.tone(d, { freq: 220, slideTo: 110, dur: 0.35, type: 'sawtooth', vol: 0.22, when: t }); m.tone(d, { freq: 110, dur: 0.4, vol: 0.3, when: t + 0.05 }); } },
  pickup_dash:  { ch: 'sfx', fn: (m, d, t) => [600, 800, 1000, 1400].forEach((f, i) => m.tone(d, { freq: f, dur: 0.07, type: 'square', vol: 0.16, when: t + i * 0.05 })) },
  pickup_slip:  { ch: 'sfx', fn: (m, d, t) => [1800, 2400, 3000].forEach((f, i) => m.tone(d, { freq: f, slideTo: f * 0.8, dur: 0.22, vol: 0.15, when: t + i * 0.07 })) },

  // Usar potenciador
  heavyUse: { ch: 'sfx', fn: (m, d, t) => { m.tone(d, { freq: 90, slideTo: 40, dur: 0.35, vol: 0.5, when: t }); m.noise(d, { dur: 0.15, vol: 0.2, hp: 200, when: t }); } },
  dash:     { ch: 'sfx', fn: (m, d, t) => { m.noise(d, { dur: 0.25, vol: 0.25, hp: 800, when: t }); m.tone(d, { freq: 300, slideTo: 900, dur: 0.15, type: 'sawtooth', vol: 0.1, when: t }); } },
  slipUse:  { ch: 'sfx', fn: (m, d, t) => m.tone(d, { freq: 1200, slideTo: 300, dur: 0.4, vol: 0.2, when: t }) },

  // Vidas y final de partida
  loseLife: { ch: 'sfx', fn: (m, d, t) => { m.tone(d, { freq: 440, slideTo: 90, dur: 0.5, type: 'sawtooth', vol: 0.28, when: t }); m.noise(d, { dur: 0.3, vol: 0.2, hp: 300, when: t }); } },
  lose:     { ch: 'sfx', fn: (m, d, t) => [392, 349, 311, 262].forEach((f, i) => m.tone(d, { freq: f, dur: i === 3 ? 0.7 : 0.25, type: 'sawtooth', vol: 0.22, when: t + i * 0.22 })) },
  win:      { ch: 'sfx', fn: (m, d, t) => {
    [523, 659, 784, 1047].forEach((f, i) => m.tone(d, { freq: f, dur: 0.16, type: 'triangle', vol: 0.3, when: t + i * 0.14 }));
    m.tone(d, { freq: 1047, dur: 0.7, type: 'triangle', vol: 0.3, when: t + 0.56 });
    m.tone(d, { freq: 1319, dur: 0.7, type: 'square', vol: 0.1, when: t + 0.56 });
  } }
};

class AudioManager {
  constructor() {
    this.ctx = null;
    this.volumes = { ...AUDIO.defaults };
    this.music = { name: null, timer: null, step: 0, nextTime: 0 };
    this.lastPlayed = {};
    this.load();
  }

  // ---- Persistencia ----
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) Object.keys(this.volumes).forEach((k) => {
        if (typeof saved[k] === 'number') this.volumes[k] = Math.min(Math.max(saved[k], 0), 1);
      });
    } catch (e) { /* sin almacenamiento: se usan los valores por defecto */ }
  }
  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.volumes)); } catch (e) { /* ignorar */ }
  }

  // ---- Contexto (los navegadores exigen un gesto del usuario) ----
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.connect(this.ctx.destination);
      this.master = this.ctx.createGain();
      this.master.connect(compressor);
      this.channels = {};
      Object.keys(CHANNEL_BASE).forEach((ch) => {
        this.channels[ch] = this.ctx.createGain();
        this.channels[ch].connect(this.master);
      });
      this.applyVolumes(true);
      const len = this.ctx.sampleRate; // 1 s de ruido blanco reutilizable
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.music.name && !this.music.timer) this.startScheduler();
  }

  // ---- Volúmenes ----
  getVolume(ch) { return this.volumes[ch]; }
  setVolume(ch, v) {
    this.volumes[ch] = Math.min(Math.max(Math.round(v * 100) / 100, 0), 1);
    this.applyVolumes();
    this.save();
  }
  applyVolumes(instant = false) {
    if (!this.ctx) return;
    Object.keys(CHANNEL_BASE).forEach((ch) => {
      const target = this.volumes[ch] * CHANNEL_BASE[ch];
      if (instant) this.channels[ch].gain.value = target;
      else this.channels[ch].gain.setTargetAtTime(target, this.ctx.currentTime, 0.02);
    });
  }

  // ---- Efectos ----
  play(name, opts = {}) {
    const def = SFX[name];
    if (!def || !this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - (this.lastPlayed[name] || -1) < 0.03) return; // evita duplicados simultáneos
    this.lastPlayed[name] = now;
    def.fn(this, this.channels[def.ch], now, opts);
  }

  // ---- Música ----
  playMusic(name) {
    if (this.music.name === name && this.music.timer) return;
    this.music.name = name;
    this.stopScheduler();
    if (this.ctx && this.ctx.state === 'running') this.startScheduler();
  }
  stopMusic() {
    this.music.name = null;
    this.stopScheduler();
  }
  stopScheduler() {
    clearInterval(this.music.timer);
    this.music.timer = null;
  }
  startScheduler() {
    const m = this.music;
    const song = SONGS[m.name];
    if (!song) return;
    m.step = 0;
    m.nextTime = this.ctx.currentTime + 0.1;
    m.timer = setInterval(() => {
      while (m.nextTime < this.ctx.currentTime + 0.25) {
        this.scheduleStep(song, m.step, m.nextTime);
        m.nextTime += 60 / song.bpm / 2;
        m.step = (m.step + 1) % (CHORDS.length * 8);
      }
    }, 50);
  }
  scheduleStep(song, step, t) {
    const d = this.channels.music;
    const stepDur = 60 / song.bpm / 2;
    const [root, semis] = CHORDS[Math.floor(step / 8)];
    const i = step % 8;
    if (i % 2 === 0) this.tone(d, { freq: midi(root), dur: stepDur * 1.8, type: 'triangle', vol: song.bassVol, when: t });
    this.tone(d, { freq: midi(root + 24 + semis[ARP[i]]), dur: stepDur * 0.9, type: 'square', vol: song.arpVol, when: t });
    if (song.drums) {
      if (i % 4 === 0) this.tone(d, { freq: 140, slideTo: 45, dur: 0.15, vol: 0.3, when: t });
      if (i % 2 === 1) this.noise(d, { dur: 0.04, vol: 0.08, hp: 6000, when: t });
    }
  }

  // ---- Primitivas ----
  tone(dest, { freq, slideTo, dur = 0.1, type = 'sine', vol = 0.3, when = 0, attack = 0.005 }) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g).connect(dest);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }
  noise(dest, { dur = 0.1, vol = 0.2, hp = 1000, when = 0 }) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(filter).connect(g).connect(dest);
    src.start(when);
    src.stop(when + dur + 0.02);
  }
}

export const audio = new AudioManager();
