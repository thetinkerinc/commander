import type { Handle } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$utils/paraglide/server.js';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = handleParaglide;
