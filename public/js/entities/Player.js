import { PLAYER, POWERUP, WORLD_GRAVITY } from '../config.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { id, name, texture, x, y, rivalDirection }) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.displayName = name;
    this.rivalDirection = rivalDirection;
    this.authority = 'LOCAL';
    this.spawn = { x, y };
    this.lives = PLAYER.lives;

    this.moveDir = 0;
    this.facing = rivalDirection;
    this.wantsDrop = false;
    this.dropThroughUntil = -Infinity;
    this.lastGroundedAt = -Infinity;
    this.airJumpsLeft = PLAYER.airJumps;

    this.held = null;
    this.dashCharges = 0;
    this.dashWindow = 0;
    this.dashBurst = 0;
    this.dashDir = rivalDirection;
    this.slipTime = 0;

    this.setCollideWorldBounds(true);
    this.body.setGravityY(PLAYER.gravity - WORLD_GRAVITY);
  }

  get onGround() { return this.body.blocked.down || this.body.touching.down; }

  move(direction) { this.moveDir = direction; }

  // "Abajo": apoyado atraviesa la plataforma; cayendo, da un impulso y luego acelera por gravedad
  drop(active) {
    this.wantsDrop = active;
    if (active && this.onGround) this.dropThroughUntil = this.scene.time.now + PLAYER.dropThroughTime;
    if (active && !this.onGround && this.body.velocity.y >= 0) {
      this.setVelocityY(Math.min(this.body.velocity.y + PLAYER.fastFallKick, PLAYER.fastFallSpeed));
    }
  }

  // Salto con Coyote Time (0,2 s tras dejar el borde) y doble salto en el aire
  jump(now) {
    if (now - this.lastGroundedAt <= PLAYER.coyoteTime) {
      this.setVelocityY(-PLAYER.jumpSpeed);
      this.lastGroundedAt = -Infinity;
    } else if (this.airJumpsLeft > 0) {
      this.airJumpsLeft -= 1;
      this.setVelocityY(-PLAYER.airJumpSpeed);
    }
  }

  // Salto corto: al soltar la tecla mientras sube, se recorta la velocidad de subida
  releaseJump() {
    if (this.body.velocity.y < -PLAYER.shortHopSpeed) this.setVelocityY(-PLAYER.shortHopSpeed);
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
    if (this.onGround && this.body.velocity.y >= 0) {
      this.lastGroundedAt = now;
      this.airJumpsLeft = PLAYER.airJumps;
    }
    if (this.moveDir !== 0) this.facing = this.moveDir;

    if (this.dashBurst > 0) {
      this.dashBurst -= delta;
      this.setVelocityX(this.dashDir * POWERUP.dash.speed);
    } else {
      const own = this.body.velocity.x;
      const target = this.moveDir * PLAYER.speed;
      let vx;
      if (this.slipTime > 0 && this.onGround) {
        const t = 1 - Math.pow(1 - POWERUP.slip.grip, delta / 16.67);
        vx = Phaser.Math.Linear(own, target, t);
      } else {
        const reversing = this.moveDir !== 0 && Math.sign(own) === -this.moveDir;
        const rate = this.moveDir === 0
          ? (this.onGround ? PLAYER.groundFriction : PLAYER.airFriction)
          : (this.onGround ? PLAYER.groundAccel : (reversing ? PLAYER.airTurnAccel : PLAYER.airAccel));
        const step = rate * delta / 1000;
        vx = Phaser.Math.Clamp(target, own - step, own + step);
      }
      this.setVelocityX(vx);
    }

    const fastFalling = this.wantsDrop && !this.onGround && this.body.velocity.y > 0;
    this.body.setGravityY(PLAYER.gravity * (fastFalling ? PLAYER.fastFallGravity : 1) - WORLD_GRAVITY);
    const maxFall = fastFalling ? PLAYER.fastFallSpeed : PLAYER.maxFallSpeed;
    if (this.body.velocity.y > maxFall) this.setVelocityY(maxFall);
  }

  respawn() {
    this.setPosition(this.spawn.x, this.spawn.y);
    this.setVelocity(0, 0);
    this.dashBurst = 0;
    this.airJumpsLeft = PLAYER.airJumps;
  }
}
