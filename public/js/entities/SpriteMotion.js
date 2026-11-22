export class SpriteMotion {
  constructor() { this.reset(); }

  reset() {
    this.phase = 0;
    this.angle = 0;
    this.bounce = 0;
    this.landing = 0;
    this.wasGrounded = false;
  }

  step(delta, vx, grounded) {
    const dt = Math.min(delta, 50) / 1000;
    const speed = Math.min(Math.abs(vx) / 450, 1.5);
    const moving = grounded && speed > 0.06;
    if (grounded && !this.wasGrounded) this.landing = 1;
    this.wasGrounded = grounded;
    this.landing = Math.max(0, this.landing - dt * 7);
    if (moving) this.phase += dt * (9 + speed * 7);
    const blend = 1 - Math.exp(-dt * 20);
    const targetAngle = moving ? Math.sin(this.phase) * 11 * Math.min(speed, 1) : (grounded ? 0 : vx / 450 * 7);
    const targetBounce = moving ? Math.abs(Math.sin(this.phase)) * 5 * Math.min(speed, 1) : 0;
    this.angle += (targetAngle - this.angle) * blend;
    this.bounce += (targetBounce - this.bounce) * blend;
    return {
      angle: this.angle, bounce: this.bounce,
      scaleX: 1 + this.landing * 0.13, scaleY: 1 - this.landing * 0.11
    };
  }
}
