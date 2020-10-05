import { Client, Message } from 'discord.js';
export interface Command {

  call: string;
  redirect?: string;

  helpText?: string;

  runner?(client: Client, message: Message, args: string[]): void;

  srcPlugin?: string;

}