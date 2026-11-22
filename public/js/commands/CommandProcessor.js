import { MoveCommand, JumpCommand, JumpReleaseCommand, DropCommand, UsePowerUpCommand } from './Commands.js';

export class CommandProcessor {
  constructor() {
    this.players = new Map();
    this.network = null;
  }

  setNetwork(networkManager) { this.network = networkManager; }

  process(command) {
    const player = command.getPlayer();
    if (player && player.authority === 'LOCAL') {
      command.execute();
      if (this.network && this.network.isConnected()) {
        this.network.send(command.serialize());
      }
    }
  }

  receiveCommand(data) {
    const player = this.players.get(data.playerId);
    if (player && player.authority === 'REMOTE') {
      const command = this.deserialize(data, player);
      if (command) command.execute();
    }
  }

  deserialize(data, player) {
    switch (data.type) {
      case 'MOVE': return new MoveCommand(player, data.direction);
      case 'JUMP': return new JumpCommand(player);
      case 'JUMP_RELEASE': return new JumpReleaseCommand(player);
      case 'DROP': return new DropCommand(player, data.active);
      case 'USE_POWERUP': return new UsePowerUpCommand(player);
      default:
        console.warn('Comando desconocido:', data.type);
        return null;
    }
  }
}
