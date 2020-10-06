import { Bot } from './bot/bot';
import { AdminPlugin } from './plugins/admin/admin.plugin';

require('dotenv').config();
main();

function main(): void {

  const bot = new Bot(process.env.TOKEN, process.env.COMMAND_PREFIX);

  bot.loadPlugins([
    new AdminPlugin(),
  ]);

  bot.setup();

  bot.login().then(
    () => console.log('logged in')
  ).catch(
    (error) => console.log('error while logging in', error)
  );

  process.on('beforeExit', () => {
    console.log('intercept exit');

    process.exit();
  })

}