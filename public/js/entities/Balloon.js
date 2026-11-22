import { audio } from '../systems/AudioManager.js';
import { BALLOON, COLORS, POWERUP, WORLD_GRAVITY, GAME_WIDTH, FLOOR_TOP, CENTER_WALL_WIDTH } from '../config.js';

export class Balloon extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'balloon');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(BALLOON.radius, 3, 3);
    this.setBounce(1);
    this.setCollideWorldBounds(true);
    this.visualSpin = 0;
    this.flightPhase = 0;

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
  get heaviness() {
    return Math.min((this.multiplier - 1) / (BALLOON.weightRampAt - 1), 1);
  }

  refreshColor() {
    const base = this.lastHitBy ? COLORS[this.lastHitBy.texture.key] : COLORS.balloon;
    const color = this.heavyTime > 0 ? Phaser.Display.Color.ValueToColor(base).darken(40).color : base;
    this.setTint(color);
  }

  reset(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.setAngle(0);
    this.visualSpin = 0;
    this.flightPhase = 0;
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

  holdFor(player) {
    this.lastHitBy = player;
    this.refreshColor();
  }

  serve() {
    this.body.setAllowGravity(true);
    this.passThrough = true;
    this.hitSide = -this.lastHitBy.rivalDirection;
    this.crossedMid = false;
    this.launchTowardsRival(this.lastHitBy);
  }

  applyWeight() {
    const t = this.heaviness;
    const heavyFactor = this.heavyTime > 0 ? POWERUP.heavy.gravityFactor : 1;
    this.gravityY = Phaser.Math.Linear(BALLOON.gravityMin, BALLOON.gravityMax, t) * heavyFactor;
    this.drag = Phaser.Math.Linear(BALLOON.dragMin, BALLOON.dragMax, t);
    this.body.setGravityY(this.gravityY - WORLD_GRAVITY);
    this.setDamping(true);
    this.body.setDrag(this.drag, this.drag);
  }

  makeHeavy(owner) {
    this.heavyTime = POWERUP.heavy.duration;
    audio.play('heavyUse');
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

  animateFlight(delta, active) {
    if (!active || !this.visible) return;
    const dt = Math.min(delta, 50) / 1000;
    const { x: vx, y: vy } = this.body.velocity;
    const target = Phaser.Math.Clamp(vx * 0.075, -28, 28);
    this.visualSpin += (target - this.visualSpin) * (1 - Math.exp(-dt * 5));
    this.flightPhase += dt * (3 + Math.min(Math.abs(vy) / 400, 2));
    this.setAngle(this.visualSpin + Math.sin(this.flightPhase) * 4);
  }

  tickFlight() {
    if (!this.passThrough) return;
    const side = this.x < GAME_WIDTH / 2 ? -1 : 1;
    const clearOfWall = Math.abs(this.x - GAME_WIDTH / 2) > BALLOON.radius + CENTER_WALL_WIDTH / 2;
    if (side !== this.hitSide && clearOfWall) {
      this.passThrough = false;
      this.crossedMid = true;
    }
  }

  // Trayectoria con rozamiento calculada para alcanzar el suelo rival.
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
    audio.play('hit', { rate: 1 + (this.multiplier - 1) * 0.08 });
    return true;
  }
}
