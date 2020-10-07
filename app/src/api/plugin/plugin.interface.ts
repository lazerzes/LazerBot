import { Bucket } from './../bucket/bucket';
import { Command } from '../command/command';
import { MessageHandler } from '../event/event-handler.types';

export interface IPlugin {

  pluginId: string;

  storageBuckets?: {
    bucketId: string;
    bucket: Bucket;
  }[];

  // Core Plugin
  commands?: Command[];

  // Event Handlers
  onMessageHandlers?: MessageHandler[];

}
