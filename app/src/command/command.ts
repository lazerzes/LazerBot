import { Client, Message } from 'discord.js';
export interface Command {

  call: string;
  redirect?: string;

  helpText?: string;

  srcPlugin?: string;

  runner?(message: Message, args: string[]): void;

}
