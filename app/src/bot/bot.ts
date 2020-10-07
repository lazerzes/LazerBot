// import { CorePlugin } from '../plugins/core/core.plugin';
// import { IPlugin } from '../api/plugin/plugin.interface';
// import { Client, Message } from 'discord.js';
// import { Command } from '../api/command/command';

// export class Bot {
//   private static onMessageHandlers: ((message: Message) => void)[];

//   private static storageBuckets: {
//     [key: string]: {
//       shouldPersist: boolean,
//       bucket: { [key: string]: any }
//       onAddHandler?: (key: string, obj: any) => void;
//     }
//   };

//   private static pluginIds: string[];


//   private static client: Client;
//   private readonly token: string;

//   constructor(
//     token: string,
//     commandPrefix?: string,
//   ) {
//     Bot.client = new Client();
//     this.token = token;
//     Bot.storageBuckets = {};
//     Bot.onMessageHandlers = [];
//     Bot.pluginIds = [];
//     this.loadPlugin(new CorePlugin(commandPrefix));
//   }

//   public onMessage(message: Message): void {

//     if (message.author.id !== Bot?.client?.user?.id ?? '') {
//       Bot.onMessageHandlers.forEach((callback: (message: Message) => void) => {
//         callback(message);
//       });
//     }

//   }

//   public registerOnMessageHandler(callback: (message: Message) => void): void {
//     Bot.onMessageHandlers.push(callback);
//   }


//   public loadPlugin(plugin: IPlugin): void {

//     if (Bot.pluginIds.indexOf(plugin.pluginId) >= 0) {
//       throw new Error(`Duplicate plugin ids are not allowed, ${plugin.pluginId} is already taken.`);
//     } else {
//       Bot.pluginIds.push(plugin.pluginId);
//     }

//     if (plugin.onMessageHandlers) {
//       Bot.onMessageHandlers.push(...plugin.onMessageHandlers);
//     }

//     if (plugin.storageBuckets) {
//       this.registerStorageBuckets(plugin.storageBuckets);
//     }

//     if (plugin.commands) {
//       this.registerCommands(plugin.commands, plugin.pluginId);
//     }

//     console.log(`${plugin.pluginId} loaded`);

//   }

//   public loadPlugins(plugins: IPlugin[]): void {
//     plugins.forEach((plugin: IPlugin) => {
//       this.loadPlugin(plugin);
//     });
//   }

//   public setup(): void {
//     Bot.client.on('message', this.onMessage);
//   }

//   public login(): Promise<string | undefined> {
//     return Bot.client.login(this.token);

//   }

//   private registerStorageBuckets(
//     storageBuckets: {
//       bucketId: string,
//       bucket: { [key: string]: any }
//       shouldPersist: boolean,
//       onAddHandler?: (key: string, obj: any) => void
//     }[]
//   ): void {

//     storageBuckets.forEach((storageBucket: {
//       bucketId: string,
//       bucket: { [key: string]: any }
//       shouldPersist: boolean,
//       onAddHandler?: (key: string, obj: any) => void
//     }) => {
//       if (Bot.storageBuckets.hasOwnProperty(storageBucket.bucketId)) {
//         throw new Error(`Duplicate Bucket Ids are not allowed, ${storageBucket.bucketId} is already taken`);
//       } else {
//         Bot.storageBuckets[storageBucket.bucketId] = {
//           bucket: storageBucket.bucket,
//           shouldPersist: storageBucket.shouldPersist,
//           onAddHandler: storageBucket.onAddHandler
//         };
//       }

//     });

//   }

//   private registerCommands(commands: Command[], pluginId: string): void {
//     commands.map(command => ({ ...command, srcPlugin: pluginId })).forEach((command: Command) =>
//       this.addDataToBucket('command', command.call, command)
//     );

//   }

//   private addDataToBucket(bucketId: string, dataId: string, data: any, options?: { failIfNoBucket?: boolean }): void {
//     if (!Bot.storageBuckets.hasOwnProperty(bucketId)) {
//       if (options?.failIfNoBucket) {
//         throw new Error(`Could not add data to bucket(${bucketId}), does not exist.`);
//       } else {
//         console.warn(`Could not add data to bucket(${bucketId}), does not exist. (skipped)`);
//         return;
//       }
//     }

//     const bucket = Bot.storageBuckets[bucketId];
//     if (bucket.onAddHandler) {
//       bucket.onAddHandler(dataId, data);
//     } else {
//       if (!bucket.bucket.hasOwnProperty(dataId)) {
//         bucket.bucket[dataId] = data;
//       } else {
//         console.warn(`Could not add data(${dataId}) to ${bucketId}, duplicate dataId. (skipped)`);
//       }
//     }

//   }

//   public savePersistentData(path: string): void {
//     console.log ('\nsaving persistent data...');
//     const persist: { [key: string]: object } = {};

//     Object.keys(Bot.storageBuckets).forEach((key: string) => {

//       const value = Bot.storageBuckets[key];

//       if (value.shouldPersist) {
//         persist[key] = value.bucket;
//       }
//     });

//     const fs = require('fs');
//     fs.writeFileSync(path, JSON.stringify(persist, null, 2));
//     console.log('persistent data saved');

//   }

//   public loadPersistentData(path: string): void {

//     console.log('loading persistent data...');

//     try {
//       const fs = require('fs');
//       const rawData = fs.readFileSync(path);
//       const persist = JSON.parse(rawData);
//       Object.keys(persist).forEach((bucketId: string) => {
//         Object.keys(persist[bucketId]).forEach((dataId: string) => {
//           this.addDataToBucket(bucketId, dataId, (persist[bucketId])[dataId]);
//         });
//       });
//     } catch (err) {
//       // pass
//     }

//     console.log('persistent data loaded');

//   }

// }
