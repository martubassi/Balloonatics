// Constantes del juego (valores del GDD). Ajusta aquí el "game feel".
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const WORLD_GRAVITY = 2200;

export const FLOOR_TOP = 1020;
export const FLOOR_HEIGHT = 60;
export const PLATFORM_HEIGHT = 30;
// [centroX, yTop, ancho] - layout simétrico
export const PLATFORMS = [
  [420, 800, 360], [1500, 800, 360],
  [960, 660, 320],
  [180, 580, 280], [1740, 580, 280]
];

export const COLORS = {
  background: 0x1B1F3B,
  pip: 0xE94560,
  beto: 0x0F9BD7,
  balloon: 0xF5C518,
  platform: 0x4A5080
};

export const PLAYER = { speed: 450, jumpSpeed: 1100, fastFallSpeed: 1200, coyoteTime: 200, lives: 3 };
export const BALLOON = { baseSpeed: 450, speedStep: 0.2, maxMultiplier: 10, gravity: 250, radius: 37, hitCooldown: 150 };
export const COUNTDOWN_SECONDS = 3;
