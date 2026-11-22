// Constantes del juego (valores del GDD). Ajusta aquí el "game feel".
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const WORLD_GRAVITY = 2200;

export const FLOOR_TOP = 1020;
export const FLOOR_HEIGHT = 60;
export const PLATFORM_HEIGHT = 30;
export const CENTER_WALL_WIDTH = 16; // muro invisible en la línea central
// Las plataformas de cada mapa están en maps.js

export const COLORS = {
  background: 0x1B1F3B,
  pip: 0xE94560,
  beto: 0x0F9BD7,
  balloon: 0xF5C518,
  platform: 0x4A5080
};

export const PLAYER = {
  speed: 450, coyoteTime: 200, lives: 3,
  // Salto estilo Smash: gravedad propia y velocidad de caída limitada. Altura máxima = jumpSpeed² / (2 · gravity) ≈ 275 px
  gravity: 1700, jumpSpeed: 967, shortHopSpeed: 550, maxFallSpeed: 800, fastFallSpeed: 1200, // shortHopSpeed: salto corto ≈ 90 px
  fastFallGravity: 3, fastFallKick: 350,         // al mantener "abajo" cayendo: multiplicador de gravedad e impulso inicial (px/s)
  dropThroughTime: 150,                          // ms que se atraviesan las plataformas tras pulsar "abajo" apoyado
  airJumps: 1, airJumpSpeed: 850,               // doble salto (0 para desactivarlo)
  groundAccel: 6000, groundFriction: 5000,       // aceleración y frenada en el suelo (px/s²)
  airAccel: 2400, airFriction: 1200,             // en el aire: más inercia
  airTurnAccel: 5000                             // al invertir el sentido en el aire (más alto = giro más rápido)
};
export const BALLOON = {
  baseSpeed: 450, speedStep: 0.2, maxMultiplier: 10,
  gravityMin: 500, gravityMax: 3000, radius: 37, hitCooldown: 150,
  dragMin: 0.25, dragMax: 0.75,
  liftMin: 1000, liftMax: 1500, // velocidad vertical de salida (px/s) hacia arriba
  weightRampAt: 5,             // multiplicador al que el globo alcanza su peso/velocidad máximos
  aimTries: 3                   // destinos probados al lanzar: se elige el más lejos del rival
};
export const COUNTDOWN_SECONDS = 3;
export const SERVE_Y = 260; // altura a la que espera el globo en el centro antes del saque

// Potenciadores (tiempos en milisegundos)
export const POWERUP = {
  heavy: { spawnEvery: 20000, duration: 6000, gravityFactor: 2, drift: 150 },
  dash: { hitsToSpawn: 5, charges: 3, duration: 10000, speed: 1500, burst: 150 },
  slip: { spawnEvery: 25000, duration: 8000, grip: 0.035 }
};

// Tecla de "usar potenciador" (event.code): J1 (WASD) = Shift izquierdo, J2 (flechas) = Shift derecho.
// Para cambiarlo, intercambiad los valores.
export const POWERUP_KEYS = { p1: 'ShiftLeft', p2: 'ShiftRight' };
export const KEY_LABEL = { ShiftLeft: 'Shift izq.', ShiftRight: 'Shift der.' };

// Audio: volumen inicial de cada canal (0..1) y cada cuántos ms suena un paso
export const AUDIO = {
  defaults: { music: 0.6, sfx: 0.8, ui: 0.8 },
  stepEvery: 280
};

// Los 4 del equipo (pantalla de créditos): cambia nombres y roles aquí
export const CREDITS = [
  { name: 'Bassi', role: 'Rol en el equipo' },
  { name: 'Integrante 2', role: 'Rol en el equipo' },
  { name: 'Integrante 3', role: 'Rol en el equipo' },
  { name: 'Integrante 4', role: 'Rol en el equipo' }
];
