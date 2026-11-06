import { PLAYER } from '../config.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { id, name, texture, x, y, rivalDirection }) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.displayName = name;
    this.rivalDirection = rivalDirection; // +1 si el rival está a la derecha, -1 a la izquierda
    this.authority = 'LOCAL';             // en el online, el otro jugador será 'REMOTE'
    this.spawn = { x, y };
    this.lives = PLAYER.lives;

    this.moveDir = 0;
    this.wantsDrop = false;
    this.lastGroundedAt = -Infinity;      // para el Coyote Time
    this.setCollideWorldBounds(true);
  }

  get onGround() { return this.body.blocked.down || this.body.touching.down; }

  move(direction) { this.moveDir = direction; }
  drop(active) { this.wantsDrop = active; }

  jump(now) {
    // Coyote Time: se puede saltar hasta 0,2 s después de dejar el borde
    if (now - this.lastGroundedAt <= PLAYER.coyoteTime) {
      this.setVelocityY(-PLAYER.jumpSpeed);
      this.lastGroundedAt = -Infinity; // evita doble salto dentro de la ventana
    }
  }

  tick(now) {
    if (this.onGround && this.body.velocity.y >= 0) this.lastGroundedAt = now;

    this.setVelocityX(this.moveDir * PLAYER.speed);

    // Descenso rápido en el aire
    if (this.wantsDrop && !this.onGround) {
      this.setVelocityY(Math.max(this.body.velocity.y, PLAYER.fastFallSpeed));
    }
  }

  respawn() {
    this.setPosition(this.spawn.x, this.spawn.y);
    this.setVelocity(0, 0);
  }
}
