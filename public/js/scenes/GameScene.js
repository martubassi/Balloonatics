import {
  GAME_WIDTH, GAME_HEIGHT, FLOOR_TOP, FLOOR_HEIGHT, PLATFORM_HEIGHT,
  PLATFORMS, COLORS, COUNTDOWN_SECONDS, POWERUP_KEYS
} from '../config.js';
import { Player } from '../entities/Player.js';
import { Balloon } from '../entities/Balloon.js';
import { PowerUpManager } from '../systems/PowerUpManager.js';
import { CommandProcessor } from '../commands/CommandProcessor.js';
import { MoveCommand, JumpCommand, DropCommand, UsePowerUpCommand } from '../commands/Commands.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.commandProcessor = new CommandProcessor();
  }

  create() {
    this.roundActive = false;
    this.createArena();
    this.createPlayers();
    this.balloon = new Balloon(this, GAME_WIDTH / 2, 260);
    this.createColliders();
    this.powerUps = new PowerUpManager(this, [this.player1, this.player2], this.balloon);
    this.createInput();
    this.createHud();

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.pause();
      this.scene.launch('PauseScene', { escenaOrigen: 'GameScene' });
    });

    this.startRound();
  }

  createArena() {
    // Sectores: izquierda = Pip, derecha = Beto
    this.add.rectangle(GAME_WIDTH / 4, GAME_HEIGHT / 2, GAME_WIDTH / 2, GAME_HEIGHT, COLORS.pip, 0.05);
    this.add.rectangle(GAME_WIDTH * 3 / 4, GAME_HEIGHT / 2, GAME_WIDTH / 2, GAME_HEIGHT, COLORS.beto, 0.05);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 4, GAME_HEIGHT, 0xffffff, 0.1);

    // El suelo es la zona de fallo: los jugadores lo pisan, el globo lo atraviesa y puntúa
    this.floor = this.physics.add.staticGroup();
    this.floor.create(GAME_WIDTH / 2, FLOOR_TOP + FLOOR_HEIGHT / 2, 'platform')
      .setDisplaySize(GAME_WIDTH, FLOOR_HEIGHT).refreshBody();

    this.platforms = this.physics.add.staticGroup();
    PLATFORMS.forEach(([x, top, w]) => {
      this.platforms.create(x, top + PLATFORM_HEIGHT / 2, 'platform')
        .setDisplaySize(w, PLATFORM_HEIGHT).refreshBody();
    });
  }

  createPlayers() {
    const y = FLOOR_TOP - 48;
    this.player1 = new Player(this, { id: 'p1', name: 'Pip', texture: 'pip', x: 480, y, rivalDirection: 1 });
    this.player2 = new Player(this, { id: 'p2', name: 'Beto', texture: 'beto', x: 1440, y, rivalDirection: -1 });

    this.commandProcessor.players.clear();
    [this.player1, this.player2].forEach((p) => this.commandProcessor.players.set(p.id, p));
  }

  createColliders() {
    const players = [this.player1, this.player2];
    this.physics.add.collider(players, this.floor);
    this.physics.add.collider(players, this.platforms, null, this.canLand, this);
    this.physics.add.collider(this.balloon, this.platforms);
    // Overlap (no collider): el impulso al globo lo calculamos nosotros en Balloon.hitBy
    this.physics.add.overlap(players, this.balloon, (player, balloon) => {
      if (this.roundActive && balloon.hitBy(player, this.time.now)) {
        this.powerUps.onBalloonHit(balloon.hits);
      }
    });
  }

  // Plataformas de un solo sentido: se aterriza desde arriba y se atraviesan subiendo o pulsando "abajo"
  canLand(player, platform) {
    return !player.wantsDrop
      && player.body.velocity.y >= 0
      && player.body.prev.y + player.body.height <= platform.body.top + 1;
  }

  createInput() {
    const kb = this.input.keyboard;
    this.bindings = [
      { player: this.player1, keys: kb.addKeys({ left: 'A', right: 'D', up: 'W', down: 'S' }), useKey: POWERUP_KEYS.p1, dir: 0, drop: false },
      { player: this.player2, keys: kb.createCursorKeys(), useKey: POWERUP_KEYS.p2, dir: 0, drop: false }
    ];

    // Usar potenciador (Shift izquierdo/derecho se distinguen por event.code)
    kb.on('keydown', (event) => {
      const b = this.bindings.find((x) => x.useKey === event.code);
      if (b && !event.repeat && this.roundActive) {
        this.commandProcessor.process(new UsePowerUpCommand(b.player));
      }
    });
  }

  createHud() {
    const style = { fontFamily: 'Arial', fontSize: '56px', fontStyle: 'bold' };
    this.livesText1 = this.add.text(40, 24, '', { ...style, color: '#E94560' });
    this.livesText2 = this.add.text(GAME_WIDTH - 40, 24, '', { ...style, color: '#0F9BD7' }).setOrigin(1, 0);
    this.speedText = this.add.text(GAME_WIDTH / 2, 24, '', { ...style, color: '#F5C518' }).setOrigin(0.5, 0);
    const small = { fontFamily: 'Arial', fontSize: '34px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    this.powerText1 = this.add.text(40, 100, '', small);
    this.powerText2 = this.add.text(GAME_WIDTH - 40, 100, '', { ...small, align: 'right' }).setOrigin(1, 0);
    this.centerText = this.add.text(GAME_WIDTH / 2, 380, '', {
      fontFamily: 'Arial', fontSize: '200px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#000000', strokeThickness: 12
    }).setOrigin(0.5);
  }

  startRound() {
    this.balloon.reset(GAME_WIDTH / 2, 260);
    this.player1.respawn();
    this.player2.respawn();

    let n = COUNTDOWN_SECONDS;
    this.centerText.setText(String(n));
    this.time.addEvent({
      delay: 1000,
      repeat: COUNTDOWN_SECONDS - 1,
      callback: () => {
        n -= 1;
        if (n > 0) {
          this.centerText.setText(String(n));
        } else {
          this.centerText.setText('');
          this.balloon.release();
          this.roundActive = true;
        }
      }
    });
  }

  onBalloonFell() {
    this.roundActive = false;
    this.balloon.freeze();
    this.powerUps.clearField();
    this.cameras.main.shake(200, 0.01);

    // Pierde una vida el jugador en cuyo sector cae el globo
    const loser = this.balloon.x < GAME_WIDTH / 2 ? this.player1 : this.player2;
    const winner = loser === this.player1 ? this.player2 : this.player1;
    loser.lives -= 1;

    if (loser.lives <= 0) {
      this.time.delayedCall(1000, () => {
        this.scene.start('ResultScene', {
          ganador: winner.displayName,
          color: winner === this.player1 ? '#E94560' : '#0F9BD7'
        });
      });
    } else {
      this.time.delayedCall(800, () => this.startRound());
    }
  }

  // Input -> comandos (solo cuando cambia el estado, pensando en enviarlos por red)
  readInput() {
    this.bindings.forEach((b) => {
      const dir = (b.keys.right.isDown ? 1 : 0) - (b.keys.left.isDown ? 1 : 0);
      if (dir !== b.dir) {
        b.dir = dir;
        this.commandProcessor.process(new MoveCommand(b.player, dir));
      }
      const drop = b.keys.down.isDown;
      if (drop !== b.drop) {
        b.drop = drop;
        this.commandProcessor.process(new DropCommand(b.player, drop));
      }
      if (Phaser.Input.Keyboard.JustDown(b.keys.up)) {
        this.commandProcessor.process(new JumpCommand(b.player));
      }
    });
  }

  powerHud(p) {
    const names = { heavy: 'GLOBO PESADO', dash: 'DASH', slip: 'ANTIDESLIZANTE' };
    const lines = [];
    if (p.held) {
      const dash = p.held === 'dash' && p.dashWindow > 0 ? ` x${p.dashCharges} (${Math.ceil(p.dashWindow / 1000)}s)` : '';
      lines.push(`LISTO: ${names[p.held]}${dash}`);
    }
    if (p.slipTime > 0) lines.push(`RESBALAS ${Math.ceil(p.slipTime / 1000)}s`);
    return lines.join('\n');
  }

  update(time, delta) {
    this.readInput();
    this.player1.tick(time, delta);
    this.player2.tick(time, delta);
    if (this.roundActive) this.powerUps.update(delta);

    if (this.roundActive && this.balloon.body.bottom >= FLOOR_TOP) this.onBalloonFell();

    this.livesText1.setText('♥'.repeat(Math.max(this.player1.lives, 0)));
    this.livesText2.setText('♥'.repeat(Math.max(this.player2.lives, 0)));
    const heavy = this.balloon.heavyTime > 0 ? `  PESADO ${Math.ceil(this.balloon.heavyTime / 1000)}s` : '';
    this.speedText.setText(`x${this.balloon.multiplier.toFixed(1)}${heavy}`);
    this.powerText1.setText(this.powerHud(this.player1));
    this.powerText2.setText(this.powerHud(this.player2));
  }
}
