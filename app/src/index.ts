import { Bot } from './core/bot/bot';
import { AdminPlugin } from './plugins/admin/admin.plugin';

const persistFile = 'bot-persist.json';

require('dotenv').config();
main();


function main(): void {

  process.on('SIGINT', () => {
    bot.stop();
    process.exit();
  });

  process.on('beforeExit', () => {
    bot.stop();
    process.exit();
  });

  const bot = new Bot(
    {
      token: process?.env?.TOKEN ?? 'no token',
      dataPersistPath: process?.env?.PERSIST_PATH ?? 'bot-persist.json',
      commandPrefix: process?.env?.COMMAND_PREFIX ?? '!'
    }
  );

  bot.setup([
    new AdminPlugin(),
  ]);
  bot.start();

}
