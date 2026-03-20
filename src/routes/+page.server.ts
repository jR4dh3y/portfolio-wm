import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ request }) => {
	const userAgent = request.headers.get('user-agent')?.toLowerCase() ?? '';

	if (userAgent.includes('curl')) {
		throw redirect(307, '/terminal-profile');
	}

	return {};
};
