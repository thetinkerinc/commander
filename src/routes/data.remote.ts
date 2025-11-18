import { error } from "@sveltejs/kit";
import * as v from 'valibot';

import { makeCommander } from "$lib/index.ts"

const promiseSchema = v.boolean();

const HasPromised = makeCommander<typeof promiseSchema>(({ data }) => {
	if (!data) {
		error(403, 'I will not reveal my secrets to you');
	}
});

export const getSecret = HasPromised.query(promiseSchema, async () => {
	const resp = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
	const json = await resp.json();
	return json.text;
});
