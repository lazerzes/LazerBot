import { Command } from './../../api/command/command';
import { Bucket } from './../../api/bucket/bucket';
import { Message } from 'discord.js';
import { IPlugin } from '../../api/plugin/plugin.interface';
import { BucketManager } from '../../api/bucket/bucket.manager';

export class CorePlugin implements IPlugin{

  constructor(
    commandPrefix: string
  ) {
    CorePlugin.commandPrefix = commandPrefix;
  }


  private static commandPrefix = '!';
  private static commandBucket: {[key: string]: Command} = {};


  pluginId = 'core';

  storageBuckets = [
    {
      bucketId: 'command',
      bucket: new Bucket(CorePlugin.commandBucket, false, this.commandAddHandler)
    },
  ];

  intervalJobs: NodeJS.Timeout[] = [];

  onMessageHandlers = [this.commandHandler];

  public static commandFinder(call: string): Command | undefined {
    const command = CorePlugin.commandBucket[call] ?? undefined;
    return command?.redirect ? CorePlugin.commandFinder(command.redirect) : command;
  }



  private async commandHandler(message: Message, bucketManager: BucketManager): Promise<void> {
    if (message.content.slice(0, CorePlugin.commandPrefix.length) === CorePlugin.commandPrefix) {
      const args = message.content.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g) ?? [];
      const command = CorePlugin.commandFinder(args[0].slice(CorePlugin.commandPrefix.length));
      const runner = command?.runner;
      if (runner) {
        await runner(message, bucketManager);
      }
    }
  }

  private commandAddHandler(call: string, command: unknown): void {

    call = CorePlugin.commandBucket[call] !== undefined ? `${(command as Command)?.srcPlugin}:${call}` : call;
    if (CorePlugin.commandBucket[call] !== undefined) {
      console.warn(`Command with call(${call}) from ${(command as Command).srcPlugin} could not be registered, duplicate call (skipped).`);
    } else {
      CorePlugin.commandBucket[call]  = command as Command;
    }

  }

}
