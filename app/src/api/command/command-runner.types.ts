import { BucketManager } from './../bucket/bucket.manager';
import { Message } from 'discord.js';


export type CommandRunner = (message: Message) => Promise<void>;
export type CommandRunnerBucket = (message: Message, bucketManager: BucketManager) => Promise<void>;