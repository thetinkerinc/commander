// Compile-time checks for the commander types (run by `bun run check`; never executed).

import { invalid } from '@sveltejs/kit';
import * as v from 'valibot';

import { makeCommander } from '#lib/index.ts';

const commander = makeCommander(() => ({ userId: 'u1' }));

// Forms: `issue` follows the schema's shape, including nested objects and arrays.
const familySchema = v.object({
	name: v.string(),
	contacts: v.array(v.object({ email: v.string() })),
	address: v.object({ city: v.string() })
});
export const saveFamily = commander.form(familySchema, ({ ctx, data, issue }) => {
	const userId: string = ctx.userId;
	const firstEmail: string = data.contacts[0].email;
	invalid(
		issue.name('Required'),
		issue.contacts[1].email('Taken'),
		issue.address.city('Unknown city'),
		issue('Form-level problem')
	);
	return { userId, firstEmail };
});
saveFamily.fields.contacts[0].email.as('email');

// Forms: a required boolean is rejected, as with kit's form().
// @ts-expect-error -- booleans in form schemas must be optional
commander.form(v.object({ agree: v.boolean() }), () => null);
commander.form(v.object({ agree: v.optional(v.boolean(), false) }), ({ data }) => data.agree);

// Queries and commands: callers pass the schema's input, handlers get its output.
const pageSchema = v.pipe(v.string(), v.transform(Number));
export const getPage = commander.query(pageSchema, ({ params }) => {
	const page: number = params;
	return page;
});
export const setPage = commander.command(pageSchema, ({ data }) => {
	const page: number = data;
	return page;
});
export function callers() {
	void getPage('2');
	void setPage('2');
	// @ts-expect-error -- the input is the string, not the transformed number
	void getPage(2);
	// @ts-expect-error -- the input is the string, not the transformed number
	void setPage(2);
}
