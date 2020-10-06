import { Client, Message } from 'discord.js';
import { Command } from '../../command/command';

import { IPlugin } from '../../bot/plugin.interface';

export class AdminPlugin implements IPlugin {

  private static persistBucket: {[key: string]: any} = {};

  pluginId: string;
  commands: Command[];

  storageBuckets = [
    {
      bucketId: 'persist',
      bucket: AdminPlugin.persistBucket,
      shouldPersist: true,
    }
  ];

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
      },
      {
        call: 'persist',
        runner: this.persistCommand
      }
    ];

  }

  pingCommand(message: Message, args: string[]): void {
    message.channel.send( {
      content: 'pong'
    });
  }

  persistCommand(message: Message, args: string[]): void {

    if (args.length >= 3 ) {
      AdminPlugin.persistBucket[args[1]] =  args[2];
    }

    message.channel.send({
      content: 'data persisted',
    });

  }

}
