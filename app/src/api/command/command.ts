import { BucketManager } from './../bucket/bucket.manager';
import { Message } from 'discord.js';
export interface Command {

  call: string;
  redirect?: string;

  helpText?: string;

  srcPlugin?: string;

  runner?(message: Message, bucketManager: BucketManager): Promise<void>;

}
