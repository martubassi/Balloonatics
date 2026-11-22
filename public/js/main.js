import { GAME_WIDTH, GAME_HEIGHT, WORLD_GRAVITY } from './config.js';
import { loadDisplayFont } from './typography.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { MapVoteScene } from './scenes/MapVoteScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { ControlsScene } from './scenes/ControlsScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { audio } from './systems/AudioManager.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  render: { antialias: true, roundPixels: true },
  backgroundColor: '#1B1F3B',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: WORLD_GRAVITY }, fps: 120, debug: false }
  },
  scene: [BootScene, MenuScene, MapVoteScene, GameScene, PauseScene, ResultScene, SettingsScene, ControlsScene, CreditsScene]
};

await loadDisplayFont();
new Phaser.Game(config);

// El audio se desbloquea antes de que el primer botón lo reproduzca.
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => audio.unlock(), true));
