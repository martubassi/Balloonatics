import { PLAYER, POWERUP } from '../config.js';

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
    this.facing = rivalDirection;         // última dirección de movimiento (para el Dash)
    this.wantsDrop = false;
    this.lastGroundedAt = -Infinity;      // para el Coyote Time

    // Potenciadores
    this.held = null;     // 'heavy' | 'dash' | 'slip' (uno a la vez)
    this.dashCharges = 0;
    this.dashWindow = 0;  // ms restantes con el Dash activo
    this.dashBurst = 0;   // ms restantes del impulso actual
    this.dashDir = rivalDirection;
    this.slipTime = 0;    // ms restantes con el suelo resbaladizo (efecto del rival)

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

  // Primera pulsación: activa el Dash (3 cargas, 10 s) y gasta una. Las siguientes gastan una más.
  dash() {
    if (this.dashWindow <= 0) {
      this.dashCharges = POWERUP.dash.charges;
      this.dashWindow = POWERUP.dash.duration;
    }
    this.dashCharges -= 1;
    this.dashDir = this.moveDir || this.facing;
    this.dashBurst = POWERUP.dash.burst;
    if (this.dashCharges <= 0) this.endDash();
  }

  endDash() {
    this.dashCharges = 0;
    this.dashWindow = 0;
    this.held = null;
  }

  makeSlippery() {
    this.slipTime = POWERUP.slip.duration;
    this.setTint(0x9fe0ff);
  }

  // Temporizadores de efectos: solo avanzan con la ronda activa
  tickEffects(delta) {
    if (this.dashWindow > 0) {
      this.dashWindow -= delta;
      if (this.dashWindow <= 0) this.endDash();
    }
    if (this.slipTime > 0) {
      this.slipTime -= delta;
      if (this.slipTime <= 0) this.clearTint();
    }
  }

  tick(now, delta) {
    if (this.onGround && this.body.velocity.y >= 0) this.lastGroundedAt = now;
    if (this.moveDir !== 0) this.facing = this.moveDir;

    if (this.dashBurst > 0) {
      this.dashBurst -= delta;
      this.setVelocityX(this.dashDir * POWERUP.dash.speed);
    } else {
      // Con el calzado del rival, en el suelo se acelera y frena poco a poco
      const grip = this.slipTime > 0 && this.onGround ? POWERUP.slip.grip : 1;
      const t = grip >= 1 ? 1 : 1 - Math.pow(1 - grip, delta / 16.67);
      this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, this.moveDir * PLAYER.speed, t));
    }

    // Descenso rápido en el aire
    if (this.wantsDrop && !this.onGround) {
      this.setVelocityY(Math.max(this.body.velocity.y, PLAYER.fastFallSpeed));
    }
  }

  respawn() {
    this.setPosition(this.spawn.x, this.spawn.y);
    this.setVelocity(0, 0);
    this.dashBurst = 0;
  }
}
