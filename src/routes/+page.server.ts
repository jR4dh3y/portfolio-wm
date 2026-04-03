import { redirect } from '@sveltejs/kit';
import { getBundledWallpapers } from '$lib/server/wallpapers';
import type { PageServerLoad } from './$types';

const mobilePattern = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;

export const load: PageServerLoad = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';

	if (userAgent.toLowerCase().includes('curl')) {
		throw redirect(307, '/terminal-profile');
	}

	return {
		bundledWallpapers: getBundledWallpapers(),
		isMobileRequest: mobilePattern.test(userAgent)
	};
};
