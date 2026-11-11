import { BALLOON, POWERUP, WORLD_GRAVITY } from '../config.js';

export class Balloon extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'balloon');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(BALLOON.radius, 3, 3); // la textura es de 80x80
    this.setBounce(1);
    this.setCollideWorldBounds(true);
    // Gravedad efectiva = gravedad del mundo + gravedad del cuerpo (así cae más lento)
    this.body.setGravityY(BALLOON.gravity - WORLD_GRAVITY);

    this.multiplier = 1;
    this.hits = 0;        // golpes seguidos en el punto actual
    this.heavyTime = 0;   // ms restantes de "globo pesado"
    this.lastHitAt = -Infinity;
  }

  get speed() { return BALLOON.baseSpeed * this.multiplier; }

  // Colocar el globo quieto (cuenta atrás) y reiniciar la velocidad
  reset(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.multiplier = 1;
    this.hits = 0;
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

  release() {
    this.body.setAllowGravity(true);
    this.setVelocity(Phaser.Math.Between(-150, 150), 0);
  }

  // Globo pesado: más gravedad y deriva hacia el campo rival de quien lo activa
  makeHeavy(owner) {
    this.heavyTime = POWERUP.heavy.duration;
    this.body.setGravityY(BALLOON.gravity * POWERUP.heavy.gravityFactor - WORLD_GRAVITY);
    this.body.setAccelerationX(owner.rivalDirection * POWERUP.heavy.drift);
    this.setTint(0x8a6a00);
  }

  clearHeavy() {
    this.heavyTime = 0;
    this.body.setGravityY(BALLOON.gravity - WORLD_GRAVITY);
    this.body.setAccelerationX(0);
    this.clearTint();
  }

  tickEffects(delta) {
    if (this.heavyTime > 0) {
      this.heavyTime -= delta;
      if (this.heavyTime <= 0) this.clearHeavy();
    }
  }

  // Golpe de un jugador: +0,2x de velocidad y dirección según el punto de contacto.
  // Devuelve true si el golpe cuenta (hay un pequeño cooldown anti-doble-golpe).
  hitBy(player, now) {
    if (now - this.lastHitAt < BALLOON.hitCooldown) return false;
    this.lastHitAt = now;
    this.hits += 1;
    this.multiplier = Math.min(this.multiplier + BALLOON.speedStep, BALLOON.maxMultiplier);

    const dir = new Phaser.Math.Vector2(this.x - player.x, this.y - player.y).normalize();
    dir.x += player.rivalDirection * 0.6; // empujar hacia el sector rival
    dir.y -= 0.4;                         // y un poco hacia arriba
    dir.normalize();
    this.setVelocity(dir.x * this.speed, dir.y * this.speed);
    return true;
  }
}
