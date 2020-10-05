import { Client, Message } from 'discord.js';
import { Command } from '../../command/command';
import { LazerPlugin } from '../../core/lazerplugin';

export class AdminPlugin implements LazerPlugin {

  pluginId: string;
  commands: Command[];

  constructor() {
    this.pluginId = 'admin';
    this.commands = [
      {
        call: 'ping',
        runner: this.pingCommand
      },
      {
        call: 'p',
        redirect: 'ping'
      }
    ];
  }
  

  pingCommand(client: Client, message: Message, args: string[]): void {
    message.channel.send( {
      content: 'pong'
    })
  }

}