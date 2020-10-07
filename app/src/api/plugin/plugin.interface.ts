import { Bucket } from './../bucket/bucket';
import { Message } from 'discord.js';
import { Command } from '../command/command';
import { BucketManager } from '../bucket/bucket.manager';

export interface IPlugin {

  pluginId: string;

  storageBuckets?: {
    bucketId: string;
    bucket: Bucket;
  }[];

  // Core Plugin
  commands?: Command[];

  // Event Handlers
  onMessageHandlers?: ((message: Message, bucketManager: BucketManager) => void)[];

}
