import { GAME_WIDTH, GAME_HEIGHT, WORLD_GRAVITY } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { MapVoteScene } from './scenes/MapVoteScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { ResultScene } from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1B1F3B',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: WORLD_GRAVITY }, fps: 120, debug: false } // debug: true para ver colisiones
  },
  scene: [BootScene, MenuScene, MapVoteScene, GameScene, PauseScene, ResultScene]
};

new Phaser.Game(config);
