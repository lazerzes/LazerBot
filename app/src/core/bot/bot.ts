import { MessageHandler } from './../../api/event/event-handler.types';
import { EventManager } from './../../api/event/event.manager';
import { BotConfig } from './bot.config';
import { CorePlugin } from './../../plugins/core/core.plugin';
import { IPlugin } from './../../api/plugin/plugin.interface';
import { BucketManager } from './../../api/bucket/bucket.manager';
import { Client, Message } from 'discord.js';

import * as fs from 'fs';
import { BotState } from './bot.state';
import { Command } from '../../api/command/command';

export class Bot {

  private client: Client = new Client();

  private readonly botConfig: BotConfig;
  private botState: BotState;


  private bucketManager: BucketManager = new BucketManager();

  private eventManager: EventManager;

  constructor(
    botConfig: BotConfig,
  ) {

    this.botConfig = botConfig;

    this.botState = new BotState();

    this.eventManager = new EventManager();

  }


  //#region bot events

  public setup(plugins: IPlugin[]): void {
    if (!this.botState.isBotRunning()) {
      this.loadPlugin(new CorePlugin(this.botConfig.commandPrefix));
      this.loadPlugins(plugins);
      this.loadPersistentData();
      this.registerEvents();
    }
  }

  public start(): void {
    if (!this.botState.isBotRunning()) {
      this.client.login(this.botConfig.token).then(
        () => {
          console.log('Logged In!');
          this.botState.setBotRunning(true);
        }
      ).catch(
        (error) => console.log('Error While Logging In \n', error)
      );
    }
  }

  public stop(): void {
    this.botState.setBotRunning(false);

    this.savePersistentData();

  }

  //#endregion bot events


  //#region plugin management

  private loadPlugin(plugin: IPlugin): void {

    if (this.botState.isPluginRegistered(plugin.pluginId)) {
      throw new Error(`Duplicate plugin id (${plugin.pluginId}).`);
    }

    this.botState.addPlugin(plugin.pluginId);

    if (plugin.storageBuckets) {
      this.bucketManager.addBuckets(plugin.storageBuckets);
    }

    if (plugin.onMessageHandlers) {
      this.eventManager.registerOnMessageHandlers(plugin.onMessageHandlers);
    }

    if (plugin.commands) {
      plugin.commands.forEach((command: Command) => {
        command = {...command, srcPlugin: plugin.pluginId};
        this.bucketManager.addDataToBucket('command', command.call, command);
      });
    }

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

  private async onMessage(message: Message): Promise<void> {

    if (message.author.bot) {
      return;
    }

    const handlerPromises: Promise<void>[] = this.eventManager.getOnMessageHandlers()
      .map((messageHandler: MessageHandler) => messageHandler(message, this.bucketManager));


    if (handlerPromises.length > 0) {
      await Promise.all(handlerPromises);
    }

  }

  //#endregion discord event handlers

  //#region data persist

  private savePersistentData(): void {

    const persist = this.bucketManager.getPersistData();
    fs.writeFileSync(this.botConfig.dataPersistPath, JSON.stringify(persist, null, 2));

  }

  private loadPersistentData(): void {

    try {
      const rawData = fs.readFileSync(this.botConfig.dataPersistPath, { encoding: 'utf-8' });
      const persist = JSON.parse(rawData);

      this.bucketManager.loadPersistData(persist);

    } catch (err) {
      // pass
    }

  }

  //#endregion data persist

}
