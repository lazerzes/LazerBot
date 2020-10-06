import { CorePlugin } from './../plugins/core/core.plugin';
import { IPlugin } from './plugin.interface';
import { Client, Message } from "discord.js";
import { Command } from "../command/command";

export class Bot {

  private static client: Client;
  private readonly token: string;

  private static onMessageHandlers: ((message: Message) => void)[];

  private static storageBuckets: Map<string, {
    bucket: Map<string, any>,
    onAddHandler?: (key: string, obj: any) => void;
  }>;

  private static pluginIds: string[];

  constructor(
    token: string,
    commandPrefix?: string,
  ) {
    Bot.client = new Client();
    this.token = token;
    Bot.storageBuckets = new Map<string, {
      bucket: Map<string, any>,
      onAddHandler?: (key: string, obj: any) => void
    }>()
    Bot.onMessageHandlers = [];
    Bot.pluginIds = [];
    this.loadPlugin(new CorePlugin(commandPrefix));
  }

  public onMessage(message: Message): void {
    
    Bot.onMessageHandlers.forEach((callback: (message: Message) => void) => {
      callback(message);
    });

  }

  public registerOnMessageHandler(_callback: (message: Message) => void) {
    Bot.onMessageHandlers.push(_callback);
  }


  public loadPlugin(plugin: IPlugin): void {

    if (Bot.pluginIds.indexOf(plugin.pluginId) >= 0) {
      throw new Error(`Duplicate plugin ids are not allowed, ${plugin.pluginId} is already taken.`);
    } else {
      Bot.pluginIds.push(plugin.pluginId);
    }

    if (plugin.onMessageHandlers) {
      Bot.onMessageHandlers.push(...plugin.onMessageHandlers);
    }

    if (plugin.storageBuckets) {
      this.registerStorageBuckets(plugin.storageBuckets);
    }

    if (plugin.commands) {
      this.registerCommands(plugin.commands, plugin.pluginId)
    }

    console.log('%c %s', 'color: green', `${plugin.pluginId} loaded`)

  }

  public loadPlugins(plugins: IPlugin[]): void {
    plugins.forEach((plugin: IPlugin) => {
     this.loadPlugin(plugin);
    });
  }

  public setup(): void {
    Bot.client.on('message', this.onMessage);
  }

  public login(): Promise<string | undefined> {
    return Bot.client.login(this.token);

  }

  private registerStorageBuckets(storageBuckets: {bucketId: string, bucket: Map<string, any>, onAddHandler?: (key: string, obj: any) => void}[]): void {
    storageBuckets.forEach((storageBucket: {
      bucketId: string,
      bucket: Map<string, any>,
      onAddHandler: (key: string, obj: any) => void
    }) => {
      if (Bot.storageBuckets.has(storageBucket.bucketId)) {
        throw new Error(`Duplicate Bucket Ids are not allowed, ${storageBucket.bucketId} is already taken`);
      } else {
        Bot.storageBuckets.set(storageBucket.bucketId, {
          bucket: storageBucket.bucket,
          onAddHandler: storageBucket.onAddHandler
        })
      }

    })
  }

  private registerCommands(commands: Command[], pluginId: string) {
    commands.map(command => ({...command, srcPlugin: pluginId})).forEach( (command: Command) =>
      this.addDataToBucket('command', command.call, command)
    );
  }

  private addDataToBucket(bucketId: string, dataId: string, data: any, options?: {failIfNoBucket?: boolean}): void {
    if (!Bot.storageBuckets.has(bucketId)) {
      if (options?.failIfNoBucket) {
        throw new Error(`Could not add data to ${bucketId}, does not exist.`)
      } else {
        console.warn(`Could not add data to ${bucketId}, does not exist. (skipped)`);
        return;
      }
    }

    const bucket = Bot.storageBuckets.get('bucketId');
    if (bucket?.onAddHandler) {
      bucket.onAddHandler(dataId, data);
    } else {
      if (!bucket?.bucket.has(dataId)) {
        bucket?.bucket.set(dataId, data);
      } else {
        console.warn(`Could not add data(${dataId}) to ${bucketId}, duplicate dataId. (skipped)`);
      }
    }
    
  }

}