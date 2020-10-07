import { BucketManager } from './../../api/bucket/bucket.manager';
import { Message } from 'discord.js';
import { Command } from '../../api/command/command';

import { IPlugin } from '../../api/plugin/plugin.interface';

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

  pingCommand(message: Message, bucketManager: BucketManager): void {
    message.channel.send( {
      content: 'pong'
    });
  }

}
