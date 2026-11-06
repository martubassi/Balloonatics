import { BALLOON, WORLD_GRAVITY } from '../config.js';

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
    this.lastHitAt = -Infinity;
  }

  get speed() { return BALLOON.baseSpeed * this.multiplier; }

  // Colocar el globo quieto (cuenta atrás) y reiniciar la velocidad
  reset(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.multiplier = 1;
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

  // Golpe de un jugador: +0,2x de velocidad y dirección según el punto de contacto
  hitBy(player, now) {
    if (now - this.lastHitAt < BALLOON.hitCooldown) return;
    this.lastHitAt = now;
    this.multiplier = Math.min(this.multiplier + BALLOON.speedStep, BALLOON.maxMultiplier);

    const dir = new Phaser.Math.Vector2(this.x - player.x, this.y - player.y).normalize();
    dir.x += player.rivalDirection * 0.6; // empujar hacia el sector rival
    dir.y -= 0.4;                         // y un poco hacia arriba
    dir.normalize();
    this.setVelocity(dir.x * this.speed, dir.y * this.speed);
  }
}
