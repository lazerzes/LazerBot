import { Bot } from './bot/bot';
import { AdminPlugin } from './plugins/admin/admin.plugin';

const persistFile = 'persist.json';

require('dotenv').config();
main();


function main(): void {

  process.on('SIGINT', () => {

    doDataPersist(bot);

    process.exit();
  });

  process.on('beforeExit', () => {

    doDataPersist(bot);

    process.exit();
  });

  const bot = new Bot(process?.env?.TOKEN ?? 'no token', process?.env?.COMMAND_PREFIX);

  bot.loadPlugins([
    new AdminPlugin(),
  ]);

  bot.setup();

  // bot.loadPersistentData(persistFile);

  bot.login().then(
    () => console.log('logged in')
  ).catch(
    (error) => console.log('error while logging in', error)
  );

}

function doDataPersist(bot: Bot): void {
  console.log('\nsaving persistent data...');
  bot.savePersistentData(persistFile);
}
