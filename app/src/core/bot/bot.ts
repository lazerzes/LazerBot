import { CorePlugin } from './../../plugins/core/core.plugin';
import { IPlugin } from './../../api/plugin/plugin.interface';
import { BucketManager } from './../../api/bucket/bucket.manager';
import { Client, Message } from 'discord.js';

import * as fs from 'fs';

export class Bot {

  private client: Client = new Client();

  private readonly token: string;
  private readonly commandPrefix: string;
  private readonly dataPersistPath: string;


  private loadedPlugins: string[] = [];

  private bucketManager: BucketManager = new BucketManager();

  private onMessageHandlers: ((message: Message, bucketManager: BucketManager) => void)[];

  private clientRunning = false;

  private clientUserId = '';

  constructor(
    token: string,
    dataPersistPath: string,
    commandPrefix: string,
  ) {
    this.token = token;

    this.dataPersistPath = dataPersistPath;
    this.commandPrefix = commandPrefix;

    this.onMessageHandlers = [];
  }


  //#region bot events

  public setup(plugins: IPlugin[]): void {
    if (!this.clientRunning) {
      this.loadPlugin(new CorePlugin(this.commandPrefix))
      this.loadPlugins(plugins);
      this.loadPersistentData();
      this.registerEvents();
    }
  }

  public start(): void {
    if (!this.clientRunning) {
      this.client.login(this.token).then(
        () => {
          console.log('Logged In!');
        }
      ).catch(
        (error) => console.log('Error While Logging I:n \n', error)
      );
    }
  }

  public stop(): void {
    this.clientRunning = false;

    this.savePersistentData();

  }

  //#endregion bot events


  //#region plugin management

  private loadPlugin(plugin: IPlugin): void {

    if (this.loadedPlugins.includes(plugin.pluginId)) {
      throw new Error(`Duplicate plugin id (${plugin.pluginId}).`);
    }

    this.loadedPlugins.push(plugin.pluginId);

    console.log(`Plugin Loaded! (${plugin.pluginId})`);

  }

  private loadPlugins(plugins: IPlugin[]): void {
    plugins.forEach((plugin: IPlugin) => this.loadPlugin(plugin));
  }

  //#endregion plugin management

  //#region discord event handlers

  private registerEvents(): void {

    this.client.on('message', this.onMessage);

  }

  private onMessage(message: Message): void {

    if (message.author.bot) {
      return;
    }

    this.onMessageHandlers.forEach(
      (callback: (message: Message, bucketManager: BucketManager) => void) => {
        callback(message, this.bucketManager);
      }
    );

  }

  //#endregion discord event handlers

  //#region data persist

  private savePersistentData(): void {

    const persist = this.bucketManager.getPersistData();
    fs.writeFileSync(this.dataPersistPath, JSON.stringify(persist, null, 2));

  }

  private loadPersistentData(): void {

    try {
      const rawData = fs.readFileSync(this.dataPersistPath, { encoding: 'utf-8' });
      const persist = JSON.parse(rawData);

      this.bucketManager.loadPersistData(persist);

    } catch (err) {
      // pass
    }

  }

  //#endregion data persist

}
