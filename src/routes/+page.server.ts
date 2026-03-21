import { redirect } from '@sveltejs/kit';
import { getBundledWallpapers } from '$lib/server/wallpapers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const userAgent = request.headers.get('user-agent')?.toLowerCase() ?? '';

	if (userAgent.includes('curl')) {
		throw redirect(307, '/terminal-profile');
	}

	return {
		bundledWallpapers: getBundledWallpapers()
	};
};
