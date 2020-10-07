import { Message } from 'discord.js';
import { BucketManager } from '../bucket/bucket.manager';

export type MessageHandler = (message: Message, bucketManager: BucketManager) => Promise<void>;
