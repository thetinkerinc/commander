import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import * as _ from 'radashi';

import { makeCommander } from '$lib/index.ts';

import responses from './responses.ts';

// Query
const promiseSchema = v.boolean();

const PromiseCommander = makeCommander(promiseSchema, ({ data }) => {
	if (!data) {
		error(403, 'I will not reveal my secrets to you');
	}
});

export const getSecret = PromiseCommander.query(promiseSchema, async () => {
	const resp = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
	const json = (await resp.json()) as { text: string };
	return json.text;
});

// Form
const nameSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty(), v.toLowerCase())
});

const NameCommander = makeCommander(nameSchema, ({ data }) => {
	if (data.name !== 'sam') {
		if (data.name?.includes('sam')) {
			error(403, _.draw(responses.maybeName)!);
		}
		error(403, _.draw(responses.badName)!);
	}
});

export const checkName = NameCommander.form(nameSchema, () => {
	return _.draw(responses.trustName)!;
});

// Command
const CookieCommander = makeCommander(({ event }) => {
	if (!event.cookies.get('is_protected')) {
		error(403, "I'm sorry, but it is too dangerous for you");
	}
});

export const adventure = CookieCommander.command(async () => {
	return 'Welcome, brave wanderer!';
});
