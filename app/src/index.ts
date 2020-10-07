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
    process?.env?.TOKEN ?? 'no token',
    process?.env?.PERSIST_PATH ?? 'bot-persist.json',
    process?.env?.COMMAND_PREFIX ?? '!'
  );

  bot.setup([
    new AdminPlugin(),
  ]);
  bot.start();

}
