export class Command {
  execute() {}
  serialize() { return {}; }
  getPlayer() { return null; }
}

export class MoveCommand extends Command {
  constructor(player, direction) {
    super();
    this.player = player;
    this.direction = direction;
  }
  execute() { this.player.move(this.direction); }
  serialize() { return { type: 'MOVE', playerId: this.player.id, direction: this.direction }; }
  getPlayer() { return this.player; }
}

export class JumpCommand extends Command {
  constructor(player) { super(); this.player = player; }
  execute() { this.player.jump(this.player.scene.time.now); }
  serialize() { return { type: 'JUMP', playerId: this.player.id }; }
  getPlayer() { return this.player; }
}

export class JumpReleaseCommand extends Command {
  constructor(player) { super(); this.player = player; }
  execute() { this.player.releaseJump(); }
  serialize() { return { type: 'JUMP_RELEASE', playerId: this.player.id }; }
  getPlayer() { return this.player; }
}

export class UsePowerUpCommand extends Command {
  constructor(player) { super(); this.player = player; }
  execute() { this.player.scene.powerUps.use(this.player); }
  serialize() { return { type: 'USE_POWERUP', playerId: this.player.id }; }
  getPlayer() { return this.player; }
}

export class DropCommand extends Command {
  constructor(player, active) {
    super();
    this.player = player;
    this.active = active;
  }
  execute() { this.player.drop(this.active); }
  serialize() { return { type: 'DROP', playerId: this.player.id, active: this.active }; }
  getPlayer() { return this.player; }
}
