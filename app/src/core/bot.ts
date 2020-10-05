import { LazerPlugin } from './lazerplugin';
import { Client, Message } from "discord.js";
import { Command } from "../command/command";

export class Bot {

  private static client: Client;
  private readonly token: string;

  public static commands: Map<string, Command>;

  constructor(
    token: string,
  ) {
    Bot.client = new Client();
    this.token = token;
    Bot.commands = new Map<string, Command>();
  }

  public onMessage(message: Message): void {

    if (message.content[0] === '!') {
      const args = message.content.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
      const command = Bot.findCommand(args[0].slice(1));
      const runner = command?.runner;
      if (runner) {
        runner(Bot.client, message, args);
      }
    }

  }

  public loadPlugins(plugins: LazerPlugin[]): void {
    plugins.forEach((plugin: LazerPlugin) => {
      plugin.commands.forEach( (command: Command) => {
        command = {...command, srcPlugin: plugin.pluginId};
        if (Bot.commands.has(command.call)) {
          console.warn(`Duplicate call signature from ${command.srcPlugin}, please rename ${command.call}. Skipping...`)
        } else {
          Bot.commands.set(command.call, command);
        }
      });
    });
  }

  public setup(): void {
    Bot.client.on('message', this.onMessage);
  }

  public login(): Promise<string | undefined> {
    return Bot.client.login(this.token);

  }

  private static findCommand(call: string): Command {
    const command = Bot.commands.get(call) ?? undefined;
    return command?.redirect ? Bot.findCommand(command.redirect) : command;
  }

}