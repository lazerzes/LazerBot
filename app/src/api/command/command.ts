import { CommandRunner, CommandRunnerBucket } from './command-runner.types';
export class Command {

  call: string;
  redirect?: string;

  helpText?: string;

  srcPlugin?: string;

  runner?: CommandRunner | CommandRunnerBucket;

  constructor (call: string, options?: {
    redirect?: string,
    helpText?: string,
    srcPlugin?: string,
    runner?: CommandRunner | CommandRunnerBucket;
  }) {
    this.call = call;
    this.redirect = options?.redirect;
    this.helpText = options?.helpText;
    this.srcPlugin = options?.srcPlugin;
    this.runner = options?.runner;
  }

}
