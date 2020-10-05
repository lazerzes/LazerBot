import { Command } from "../command/command";

export interface LazerPlugin {

  pluginId: string;
  commands: Command[];

}