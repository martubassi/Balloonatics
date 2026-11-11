import { POWERUP, PLATFORMS, GAME_WIDTH } from '../config.js';

// Cajas de potenciador: aparición, recogida y activación.
// Globo pesado (plataformas aéreas, cada 20 s), Dash (centro, cada 5 golpes seguidos)
// y Calzado antideslizante (plataformas inferiores, cada 25 s).
export class PowerUpManager {
  constructor(scene, players, balloon) {
    this.scene = scene;
    this.players = players;
    this.balloon = balloon;
    this.timers = { heavy: 0, slip: 0 };

    this.boxes = scene.physics.add.group({ allowGravity: false, immovable: true });
    scene.physics.add.overlap(players, this.boxes, (player, box) => this.collect(player, box));
  }

  // Solo se llama con la ronda activa
  update(delta) {
    this.timers.heavy += delta;
    this.timers.slip += delta;
    if (this.timers.heavy >= POWERUP.heavy.spawnEvery) {
      this.timers.heavy = 0;
      this.spawnOnPlatform('heavy', 'air');
    }
    if (this.timers.slip >= POWERUP.slip.spawnEvery) {
      this.timers.slip = 0;
      this.spawnOnPlatform('slip', 'low');
    }
    this.balloon.tickEffects(delta);
    this.players.forEach((p) => p.tickEffects(delta));
  }

  onBalloonHit(hits) {
    if (hits % POWERUP.dash.hitsToSpawn === 0) {
      this.spawn('dash', GAME_WIDTH / 2, POWERUP.dash.spawnY);
    }
  }

  spawnOnPlatform(kind, type) {
    const options = PLATFORMS.filter((p) => p[3] === type);
    const [cx, top, w] = Phaser.Utils.Array.GetRandom(options);
    const x = Phaser.Math.Between(cx - w / 2 + 40, cx + w / 2 - 40);
    this.spawn(kind, x, top - 40);
  }

  spawn(kind, x, y) {
    // Como máximo una caja de cada tipo en el mapa
    if (this.boxes.getChildren().some((b) => b.kind === kind)) return;
    const box = this.boxes.create(x, y, `pu_${kind}`);
    box.kind = kind;
    const tween = this.scene.tweens.add({
      targets: box, angle: { from: -8, to: 8 }, duration: 500, yoyo: true, repeat: -1
    });
    box.once('destroy', () => tween.remove());
  }

  collect(player, box) {
    if (player.held) return; // un potenciador a la vez
    player.held = box.kind;
    box.destroy();
  }

  // Tecla de "usar potenciador"
  use(player) {
    switch (player.held) {
      case 'heavy':
        this.balloon.makeHeavy(player);
        player.held = null;
        break;
      case 'slip':
        this.players.find((p) => p !== player).makeSlippery(); // el portador conserva la tracción
        player.held = null;
        break;
      case 'dash':
        player.dash();
        break;
      default:
    }
  }

  // Al terminar el punto: fuera cajas y se acaba el globo pesado
  clearField() {
    this.boxes.clear(true, true);
    this.balloon.clearHeavy();
  }
}
