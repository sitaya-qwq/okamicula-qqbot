/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { createLogger } from "@gambonny/cflo";
import { HandleRequest } from "./Requests";
import { QQBotAPIClient } from "./APIClient/QQBotAPIClient/QQBotAPIClient";
import { env } from "cloudflare:workers";

export const logger = createLogger({
  level: 'info',      // 可选: debug, info, log, warn, error
  format: 'json',     // 可选: json, pretty
  context: {          // 这个对象里的字段会附加到每条日志里
    environment: 'dev'
  }
});

export const qqbotAPIClient :QQBotAPIClient = new QQBotAPIClient(env.QQBOT_URL,"QQBotAPIClient");

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return HandleRequest(request,ctx);
	},
} satisfies ExportedHandler<Env>;
