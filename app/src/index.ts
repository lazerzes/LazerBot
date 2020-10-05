import { Bot } from './core/bot';
import { AdminPlugin } from './plugins/admin/admin.plugin';

require('dotenv').config();
main();

function main(): void {

  const bot = new Bot(process.env.TOKEN);

  bot.loadPlugins([
    new AdminPlugin(),
  ]);

  bot.setup();

  bot.login().then(
    () => console.log('logged in')
  ).catch(
    (error) => console.log('error while logging in', error)
  );

}