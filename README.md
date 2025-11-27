# Commander

Commander is a SvelteKit utility library that lets you easily add customizable auth protection to your remote functions

## Basic setup

1. Install

```
npm install @thetinkerinc/commander
pnpm add @thetinkerinc/commander
bun add @thetinkerinc/commander
yarn add @thetinkerinc/commander
```

2. Create a commander

```typescript
import { makeCommander } from '@thetinkerinc/commander';
import { error } from '@sveltejs/kit';
import auth from './auth';
import db from './db';

export const AuthenticatedCommander = makeCommander(async ({ event }) => {
	const userId = auth.decode(event.cookies.get('auth_token'));
	const user = await db.getUser(userId);
	if (!user) {
		error(403, 'You need to log in to perform this action');
	}
	return {
		userId: user.id
	};
});
```

3. Write protected functions

```typescript
import { AuthenticatedCommander } from './commanders.ts';
import { postSchema } from './schemas';
import db from './db';

export const getPosts = AuthenticatedCommander.query(async ({ ctx }) => {
	return await db.getPosts({
		where: {
			user: ctx.userId
		}
	});
});

export const makePost = AuthenticatedCommander.form(postSchema, async ({ ctx, data }) => {
	return await db.makePost({
		...data,
		user: ctx.userId
	});
});
```

## Detailed usage

You use the `makeCommander` function to make reusable authentication schemes for your remote functions.

```typescript
commander = makeCommander(({ event, data }) => any);
commander.query(schema, async ({ ctx, params }) => any);
commander.form(schema, async ({ ctx, data }) => any);
commander.command(schema, async ({ ctx, data }) => any);
```

You'll have access to the current request's [event](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent) (no need to call [getRequestEvent](https://svelte.dev/docs/kit/remote-functions#Using-getRequestEvent)), as well as whatever data, if any, was provided. The typical body of a commander will perform some sort of validation, return an [error](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent) if it fails, then optionally return some data which can be used in your remote functions.

The commander will run the function body before each invocation of its remote functions.

### Usage with schemas and TypeScript

It's possible to add type safety with Commander through the use of a [standard schema](https://standardschema.dev/) (Zod, Valibot, ArkType, etc.).

Commander doesn't do any schema validation on its own. It simply uses SvelteKit's handling of schemas. Because of that, schemas are optional the same way base remote function schemas are optional, and if the provided data fails schema validation, neither the commander body nor the remote function body will be run.

```typescript
import { error } from '@sveltejs/kit';
import { makeCommander } from '@thetinkerinc/commander';
import * as v from 'valibot';
import db from './db';

const postSchema = v.object({
	title: v.string(),
	body: v.pipe(v.string(), v.maxLength(256))
});

const commander = makeCommander(postSchema, ({ event, data }) => {
	// data is guaranteed to conform to postSchema
	const userId = event.cookies.get('user_id');
	if (!userId) {
		error(403, 'Please log in first');
	}
	return userId;
});

export const createPost = commander.form(postSchema, ({ ctx, data }) => {
	await db.createPost({
		...data,
		userId: ctx
	});
});

export const updatePost = commander.form(postSchema, ({ data }) => {
	await db.updatePost(data);
});
```
