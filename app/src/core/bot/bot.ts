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

  private static client: Client = new Client();

  private static botState: BotState;
  private static bucketManager: BucketManager = new BucketManager();
  private static eventManager: EventManager;

  private readonly botConfig: BotConfig;


  constructor(
    botConfig: BotConfig,
  ) {

    this.botConfig = botConfig;

    Bot.botState = new BotState();

    Bot.eventManager = new EventManager();

  }


  //#region bot events

  public setup(plugins: IPlugin[]): void {
    if (!Bot.botState.isBotRunning()) {
      this.loadPlugin(new CorePlugin(this.botConfig.commandPrefix));
      this.loadPlugins(plugins);
      this.loadPersistentData();
      this.registerEvents();
    }
  }

  public start(): void {
    if (!Bot.botState.isBotRunning()) {
      Bot.client.login(this.botConfig.token).then(
        () => {
          console.log('Logged In!');
          Bot.botState.setBotRunning(true);
        }
      ).catch(
        (error) => console.log('Error While Logging In \n', error)
      );
    }
  }

  public stop(): void {
    Bot.botState.setBotRunning(false);

    this.savePersistentData();

  }

  //#endregion bot events


  //#region plugin management

  private loadPlugin(plugin: IPlugin): void {

    if (Bot.botState.isPluginRegistered(plugin.pluginId)) {
      throw new Error(`Duplicate plugin id (${plugin.pluginId}).`);
    }

    Bot.botState.addPlugin(plugin.pluginId);

    if (plugin.storageBuckets) {
      Bot.bucketManager.addBuckets(plugin.storageBuckets);
    }

    if (plugin.onMessageHandlers) {
      Bot.eventManager.registerOnMessageHandlers(plugin.onMessageHandlers);
    }

    if (plugin.commands) {
      plugin.commands.forEach((command: Command) => {
        command = {...command, srcPlugin: plugin.pluginId};
        Bot.bucketManager.addDataToBucket('command', command.call, command);
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

    Bot.client.on('message', this.onMessage);

  }

  private async onMessage(message: Message): Promise<void> {

    if (message.author.bot) {
      return;
    }

    const handlerPromises: Promise<void>[] = Bot.eventManager.getOnMessageHandlers()
      .map((messageHandler: MessageHandler) => messageHandler(message, Bot.bucketManager));


    if (handlerPromises.length > 0) {
      await Promise.all(handlerPromises);
    }

  }

  //#endregion discord event handlers

  //#region data persist

  private savePersistentData(): void {

    const persist = Bot.bucketManager.getPersistData();
    fs.writeFileSync(this.botConfig.dataPersistPath, JSON.stringify(persist, null, 2));

  }

  private loadPersistentData(): void {

    try {
      const rawData = fs.readFileSync(this.botConfig.dataPersistPath, { encoding: 'utf-8' });
      const persist = JSON.parse(rawData);

      Bot.bucketManager.loadPersistData(persist);

    } catch (err) {
      // pass
    }

  }

  //#endregion data persist

}
