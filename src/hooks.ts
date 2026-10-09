import type { Reroute } from '@sveltejs/kit/hooks';
import { deLocalizeUrl } from '$utils/paraglide/runtime.js';

export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
