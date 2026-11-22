import { GAME_WIDTH, GAME_HEIGHT, WORLD_GRAVITY } from './config.js';
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
  backgroundColor: '#1B1F3B',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: WORLD_GRAVITY }, fps: 120, debug: false } // debug: true para ver colisiones
  },
  scene: [BootScene, MenuScene, MapVoteScene, GameScene, PauseScene, ResultScene, SettingsScene, ControlsScene, CreditsScene]
};

new Phaser.Game(config);

// El navegador solo permite audio tras un gesto del usuario: se activa con la primera pulsación/tecla
// (en fase de captura, para que el primer clic ya suene)
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => audio.unlock(), true));
