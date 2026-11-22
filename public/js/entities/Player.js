import { PLAYER, POWERUP, WORLD_GRAVITY, AUDIO } from '../config.js';
import { audio } from '../systems/AudioManager.js';
import { SpriteMotion } from './SpriteMotion.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { id, name, texture, x, y, rivalDirection }) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // La imagen se balancea por separado para no alterar la colisión de 64x96.
    this.setVisible(false);
    this.visual = scene.add.sprite(x, y + 48, `art_${texture}`).setOrigin(0.5, 1).setDisplaySize(64, 96);
    this.shadow = scene.add.ellipse(x, y + 47, 48, 10, 0x071326, 0.25);
    scene.children.moveBelow(this.shadow, this.visual);
    this.spriteMotion = new SpriteMotion();
    scene.events.on('postupdate', this.updateVisual, this);
    this.once('destroy', () => {
      scene.events.off('postupdate', this.updateVisual, this);
      this.visual.destroy();
      this.shadow.destroy();
    });

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
    this.lastStepAt = -Infinity;

    this.held = null;
    this.dashCharges = 0;
    this.dashWindow = 0;
    this.dashBurst = 0;
    this.dashDir = rivalDirection;
    this.slipTime = 0;

    this.airJumpsLeft = PLAYER.airJumps;

    this.setCollideWorldBounds(true);
    this.body.setGravityY(PLAYER.gravity - WORLD_GRAVITY);
  }

  get onGround() { return this.body.blocked.down || this.body.touching.down; }

  updateVisual(time, delta = 16.67) {
    if (!this.body || !this.visual.active) return;
    const pose = this.spriteMotion.step(delta, this.body.velocity.x, this.onGround);
    this.visual.setPosition(this.x, this.body.bottom - pose.bounce)
      .setAngle(pose.angle).setDisplaySize(64 * pose.scaleX, 96 * pose.scaleY);
    if (this.slipTime > 0) this.visual.setTint(0x9fe0ff);
    else this.visual.clearTint();
    this.shadow.setPosition(this.x, this.body.bottom - 1).setVisible(this.onGround);
    this.shadow.setScale(1 - pose.bounce * 0.025);
  }

  move(direction) { this.moveDir = direction; }
  drop(active) {
    this.wantsDrop = active;
    if (active && this.onGround) this.dropThroughUntil = this.scene.time.now + PLAYER.dropThroughTime;
    if (active && !this.onGround && this.body.velocity.y >= 0) {
      this.setVelocityY(Math.min(this.body.velocity.y + PLAYER.fastFallKick, PLAYER.fastFallSpeed));
    }
  }

  jump(now) {
    if (now - this.lastGroundedAt <= PLAYER.coyoteTime) {
      this.setVelocityY(-PLAYER.jumpSpeed);
      audio.play('jump');
      this.lastGroundedAt = -Infinity;
    } else if (this.airJumpsLeft > 0) {
      this.airJumpsLeft -= 1;
      this.setVelocityY(-PLAYER.airJumpSpeed);
      audio.play('airJump');
    }
  }

  releaseJump() {
    if (this.body.velocity.y < -PLAYER.shortHopSpeed) this.setVelocityY(-PLAYER.shortHopSpeed);
  }

  dash() {
    if (this.dashWindow <= 0) {
      this.dashCharges = POWERUP.dash.charges;
      this.dashWindow = POWERUP.dash.duration;
    }
    this.dashCharges -= 1;
    this.dashDir = this.moveDir || this.facing;
    this.dashBurst = POWERUP.dash.burst;
    audio.play('dash');
    if (this.dashCharges <= 0) this.endDash();
  }

  endDash() {
    this.dashCharges = 0;
    this.dashWindow = 0;
    this.held = null;
  }

  makeSlippery() {
    this.slipTime = POWERUP.slip.duration;
    audio.play('slipUse');
    this.setTint(0x9fe0ff);
  }

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

    if (this.onGround && this.moveDir !== 0 && Math.abs(this.body.velocity.x) > 120 && now - this.lastStepAt > AUDIO.stepEvery) {
      this.lastStepAt = now;
      audio.play('step');
    }

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
    this.spriteMotion.reset();
    this.updateVisual(0, 0);
  }
}
