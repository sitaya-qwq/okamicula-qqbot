import { BaseCommand } from "./BaseCommand";
import { HelpCommand } from "./HelpCommand";
import { EchoCommand } from "./EchoCommand";

export const commandMap: Map<string,BaseCommand> = new Map([
    ["help",new HelpCommand("help","for help") as BaseCommand],
    ["echo", new EchoCommand("echo","repeat what you say") as BaseCommand]
]);