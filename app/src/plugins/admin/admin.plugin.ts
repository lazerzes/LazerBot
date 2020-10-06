import { Client, Message } from 'discord.js';
import { Command } from '../../command/command';

import { IPlugin } from '../../bot/plugin.interface';

export class AdminPlugin implements IPlugin {

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

  pingCommand(message: Message, args: string[]): void {
    message.channel.send( {
      content: 'pong'
    });
  }

}
