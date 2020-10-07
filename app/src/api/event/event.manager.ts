import { MessageHandler } from './event-handler.types';


export class EventManager {

  private onMessageHandlers: MessageHandler[];

  constructor() {
    this.onMessageHandlers = [];
  }

  public registerOnMessageHandlers(messageHandlers: MessageHandler[]): void {
    messageHandlers.forEach((handler: MessageHandler) => this.registerOnMessageHandler(handler));
  }

  public registerOnMessageHandler(messageHandler: MessageHandler): void {
    this.onMessageHandlers.push(messageHandler);
  }

  public getOnMessageHandlers(): MessageHandler[] {
    return this.onMessageHandlers;
  }

}
