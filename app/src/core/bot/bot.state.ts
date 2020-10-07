export class BotState {

  private isRunning: boolean;
  private loadedPlugins: string[];

  constructor() {
    this.isRunning = false;
    this.loadedPlugins = [];
  }

  public isBotRunning(): boolean {
    return this.isRunning;
  }

  public setBotRunning(botRunning: boolean): void {
    this.isRunning = botRunning;
  }

  public isPluginRegistered(pluginId: string): boolean {
    return this.loadedPlugins.includes(pluginId);
  }

  public addPlugin(pluginId: string): void {
    this.loadedPlugins.push(pluginId);
  }

  public clearPlugins(): void {
    this.loadedPlugins = [];
  }

}
