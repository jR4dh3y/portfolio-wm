import { terminalProfile } from '$lib/terminal-profile';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () =>
	new Response(`${terminalProfile}\n`, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=300'
		}
	});
