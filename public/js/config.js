export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const WORLD_GRAVITY = 2200;

export const FLOOR_TOP = 1020;
export const FLOOR_HEIGHT = 60;
export const PLATFORM_HEIGHT = 30;
export const CENTER_WALL_WIDTH = 16;

export const COLORS = {
  background: 0x1B1F3B,
  pip: 0xE94560,
  beto: 0x0F9BD7,
  balloon: 0xF5C518,
  platform: 0x4A5080
};

export const PLAYER = {
  speed: 450, coyoteTime: 200, lives: 3,
  gravity: 1700, jumpSpeed: 967, shortHopSpeed: 550, maxFallSpeed: 800, fastFallSpeed: 1200,
  fastFallGravity: 3, fastFallKick: 350,
  dropThroughTime: 150,
  airJumps: 1, airJumpSpeed: 850,
  groundAccel: 6000, groundFriction: 5000,
  airAccel: 2400, airFriction: 1200,
  airTurnAccel: 5000
};
export const BALLOON = {
  baseSpeed: 450, speedStep: 0.2, maxMultiplier: 10,
  gravityMin: 500, gravityMax: 3000, radius: 37, hitCooldown: 150,
  dragMin: 0.25, dragMax: 0.75,
  liftMin: 1000, liftMax: 1500,
  weightRampAt: 5,
  aimTries: 3
};
export const COUNTDOWN_SECONDS = 3;
export const SERVE_Y = 260;

export const POWERUP = {
  heavy: { spawnEvery: 20000, duration: 6000, gravityFactor: 2, drift: 150 },
  dash: { hitsToSpawn: 5, charges: 3, duration: 10000, speed: 1500, burst: 150 },
  slip: { spawnEvery: 25000, duration: 8000, grip: 0.035 }
};

export const POWERUP_KEYS = { p1: 'ShiftLeft', p2: 'ShiftRight' };
export const KEY_LABEL = { ShiftLeft: 'Shift izq.', ShiftRight: 'Shift der.' };

export const AUDIO = {
  defaults: { music: 0.6, sfx: 0.8, ui: 0.8 },
  stepEvery: 280
};

export const CREDITS = [
  { name: 'Martina Bassi', role: 'Programador y Game Designer' },
  { name: 'Darío Ayala Alocén', role: 'Programador Principal' },
  { name: 'Mateo González Falquina', role: 'Productor y Encargado de Sonido' },
  { name: 'Arturo de María García Díaz', role: 'Artista UI UX' }
];
