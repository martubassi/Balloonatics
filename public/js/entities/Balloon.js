import { BALLOON, COLORS, POWERUP, WORLD_GRAVITY, GAME_WIDTH, FLOOR_TOP, CENTER_WALL_WIDTH } from '../config.js';

export class Balloon extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'balloon');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(BALLOON.radius, 3, 3);
    this.setBounce(1);
    this.setCollideWorldBounds(true);

    this.multiplier = 1;
    this.hits = 0;
    this.heavyTime = 0;
    this.lastHitAt = -Infinity;
    this.lastHitBy = null;
    this.passThrough = false;
    this.hitSide = 0;
    this.crossedMid = false;

    this.applyWeight();
    this.refreshColor();
  }

  get speed() { return BALLOON.baseSpeed * this.multiplier; }

  // 0..1: el peso y la velocidad máximos se alcanzan con el multiplicador BALLOON.weightRampAt
  get heaviness() {
    return Math.min((this.multiplier - 1) / (BALLOON.weightRampAt - 1), 1);
  }

  // Color del último jugador que lo tocó (amarillo si nadie); más oscuro si está pesado
  refreshColor() {
    const base = this.lastHitBy ? COLORS[this.lastHitBy.texture.key] : COLORS.balloon;
    const color = this.heavyTime > 0 ? Phaser.Display.Color.ValueToColor(base).darken(40).color : base;
    this.setTint(color);
  }

  // Colocar el globo quieto (cuenta atrás) y reiniciar la velocidad
  reset(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.multiplier = 1;
    this.hits = 0;
    this.lastHitBy = null;
    this.passThrough = false;
    this.crossedMid = false;
    this.clearHeavy();
    this.freezeBody();
  }

  freeze() {
    this.freezeBody();
    this.setVisible(false);
  }

  freezeBody() {
    this.setVelocity(0, 0);
    this.body.setAllowGravity(false);
  }

  // Saque: durante la cuenta atrás el globo espera quieto en el centro, con el color del sacador
  holdFor(player) {
    this.lastHitBy = player;
    this.refreshColor();
  }

  // Al acabar la cuenta atrás sale hacia el campo rival como si lo hubiera golpeado el sacador
  serve() {
    this.body.setAllowGravity(true);
    this.passThrough = true;
    this.hitSide = -this.lastHitBy.rivalDirection;
    this.crossedMid = false;
    this.launchTowardsRival(this.lastHitBy);
  }

  // Gravedad y drag según el peso del globo (la gravedad se multiplica con el potenciador pesado)
  applyWeight() {
    const t = this.heaviness;
    const heavyFactor = this.heavyTime > 0 ? POWERUP.heavy.gravityFactor : 1;
    this.gravityY = Phaser.Math.Linear(BALLOON.gravityMin, BALLOON.gravityMax, t) * heavyFactor;
    this.drag = Phaser.Math.Linear(BALLOON.dragMin, BALLOON.dragMax, t);
    this.body.setGravityY(this.gravityY - WORLD_GRAVITY);
    this.setDamping(true);
    this.body.setDrag(this.drag, this.drag);
  }

  // Globo pesado: más gravedad y deriva hacia el campo rival de quien lo activa
  makeHeavy(owner) {
    this.heavyTime = POWERUP.heavy.duration;
    this.applyWeight();
    this.body.setAccelerationX(owner.rivalDirection * POWERUP.heavy.drift);
    this.refreshColor();
  }

  clearHeavy() {
    this.heavyTime = 0;
    this.applyWeight();
    this.body.setAccelerationX(0);
    this.refreshColor();
  }

  tickEffects(delta) {
    if (this.heavyTime > 0) {
      this.heavyTime -= delta;
      if (this.heavyTime <= 0) this.clearHeavy();
    }
  }

  // Al cruzar del todo la mitad del mapa, el globo vuelve a colisionar con las plataformas y con el muro central
  tickFlight() {
    if (!this.passThrough) return;
    const side = this.x < GAME_WIDTH / 2 ? -1 : 1;
    const clearOfWall = Math.abs(this.x - GAME_WIDTH / 2) > BALLOON.radius + CENTER_WALL_WIDTH / 2;
    if (side !== this.hitSide && clearOfWall) {
      this.passThrough = false;
      this.crossedMid = true;
    }
  }

  // Lanzar el globo hacia el sector rival: siempre en parábola (sale hacia arriba)
  launchTowardsRival(player) {
    this.applyWeight();

    const margin = 120;
    const half = GAME_WIDTH / 2;
    const pickX = () => (player.rivalDirection === 1
      ? Phaser.Math.Between(half + margin, GAME_WIDTH - margin)
      : Phaser.Math.Between(margin, half - margin));

    let targetX = pickX();
    if (player.rival) {
      for (let i = 1; i < BALLOON.aimTries; i++) {
        const candidate = pickX();
        if (Math.abs(candidate - player.rival.x) > Math.abs(targetX - player.rival.x)) targetX = candidate;
      }
    }
    const targetY = FLOOR_TOP - BALLOON.radius;

    const dx = targetX - this.x;
    const c = -Math.log(this.drag);
    const a = this.gravityY / c;

    let vy = -Phaser.Math.Linear(BALLOON.liftMin, BALLOON.liftMax, this.heaviness);

    const apexY = (v) => {
      const tA = Math.log((a - v) / a) / c;
      return this.y + a * tA + (v - a) * (1 - Math.exp(-c * tA)) / c;
    };
    while (apexY(vy) < BALLOON.radius + 40 && vy < -300) vy *= 0.95;

    const yAt = (t) => this.y + a * t + (vy - a) * (1 - Math.exp(-c * t)) / c;
    let T = 0.05;
    while (T < 10 && !(yAt(T) >= targetY && T > 0.2)) T += 1 / 120;

    const vx = dx * c / (1 - Math.exp(-c * T));

    this.setVelocity(vx, vy);
  }

  // Golpe de un jugador: +0,2x de velocidad y trayectoria hacia el sector rival.
  // Devuelve true si el golpe cuenta.
  hitBy(player, now) {
    if (player === this.lastHitBy) return false;
    if (now - this.lastHitAt < BALLOON.hitCooldown) return false;
    this.lastHitAt = now;
    this.lastHitBy = player;
    this.refreshColor();

    this.hits += 1;
    this.multiplier = Math.min(this.multiplier + BALLOON.speedStep, BALLOON.maxMultiplier);

    if (this.heavyTime > 0) this.clearHeavy();
    this.passThrough = true;
    this.hitSide = this.x < GAME_WIDTH / 2 ? -1 : 1;
    this.crossedMid = false;

    this.launchTowardsRival(player);
    return true;
  }
}
