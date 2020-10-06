import { Message } from 'discord.js';
import { Command } from '../command/command';

export interface IPlugin {

  pluginId: string;
  storageBuckets?: {
    bucketId: string;
    bucket: Map<string, any>;
    shouldPersist: boolean;
    onAddHandler?: (key: string, object: any) => void;
  }[];

  // Core Plugin
  commands?: Command[];

  // Event Handlers
  onMessageHandlers?: ((message: Message) => void)[];

}
