import { Message } from 'discord.js';
import { Command } from '../../command/command';
import { IPlugin } from './../../bot/plugin.interface';

export class CorePlugin implements IPlugin{


  constructor(
    commandPrefix?: string
  ) {
    CorePlugin.commandPrefix = commandPrefix ? commandPrefix : CorePlugin.commandPrefix;
  }

  private static CommandBucket = new Map<string, Command>();

  private static commandPrefix = '!';

  pluginId = 'core';

  storageBuckets = [
    {
      bucketId: 'command',
      bucket: CorePlugin.CommandBucket,
      onAddHandler: CorePlugin.commandAddHandler,
    }
  ];

  onMessageHandlers = [CorePlugin.commandHandler];


  public static commandHandler(message: Message): void {
    if (message.content.slice(0, CorePlugin.commandPrefix.length) === CorePlugin.commandPrefix) {
      const args = message.content.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g) ?? [];
      const command = CorePlugin.commandFinder(args[0].slice(CorePlugin.commandPrefix.length));
      const runner = command?.runner;
      if (runner) {
        runner(message, args);
      }
    }
  }

  public static commandFinder(call: string): Command | undefined {
    const command = CorePlugin.CommandBucket.get(call) ?? undefined;
    return command?.redirect ? CorePlugin.commandFinder(command.redirect) : command;
  }

  public static commandAddHandler(call: string, command: Command): void {
    call = CorePlugin.CommandBucket.has(call) ? `${command.srcPlugin}:${call}` : call;
    if (CorePlugin.CommandBucket.has(call)) {
      console.warn(`Command with call(${call}) from ${command.srcPlugin} could not be registered, duplicate call (skipped).`);
    } else {
      CorePlugin.CommandBucket.set(call, command);
    }

  }

}
