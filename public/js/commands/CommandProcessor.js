import { MoveCommand, JumpCommand, DropCommand, UsePowerUpCommand } from './Commands.js';

export class CommandProcessor {
  constructor() {
    this.players = new Map(); // id -> Player
    this.network = null;      // se enchufará cuando exista la parte online
  }

  setNetwork(networkManager) { this.network = networkManager; }

  // Comandos del jugador local: ejecutar ya y (si hay red) transmitir
  process(command) {
    const player = command.getPlayer();
    if (player && player.authority === 'LOCAL') {
      command.execute();
      if (this.network && this.network.isConnected()) {
        this.network.send(command.serialize());
      }
    }
  }

  // Comandos recibidos por red: solo para jugadores REMOTE
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
      case 'DROP': return new DropCommand(player, data.active);
      case 'USE_POWERUP': return new UsePowerUpCommand(player);
      default:
        console.warn('Comando desconocido:', data.type);
        return null;
    }
  }
}
