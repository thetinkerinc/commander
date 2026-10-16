import type { RequestEvent } from '@sveltejs/kit';

import type {
	RemoteQueryFunction,
	RemoteForm,
	RemoteFormInput,
	RemoteFormInvalidField,
	RemoteCommand
} from '$app/server';

import type { StandardSchemaV1 } from '@standard-schema/spec';

export type Commander<TCtx> = {
	query: ProtectedQuery<TCtx>;
	form: ProtectedForm<TCtx>;
	command: ProtectedCommand<TCtx>;
};

type Input<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferInput<TSchema>;
type Output<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<TSchema>;

// Not exported from '@sveltejs/kit' (it's declared but unexported inside '$app/server''s own
// module augmentation), so re-declared here — needed so an async handler's `TReturn` infers as
// the awaited value (e.g. `{ success: boolean }`), not the raw `Promise<{ success: boolean }>`
// the function itself returns. Without this, `RemoteForm<TInput, TReturn>`'s `.result` ends up
// typed as a Promise, breaking direct access like `someForm.result?.success`.
type MaybePromise<T> = T | Promise<T>;

// Also unexported from '$app/server': form()'s compile-time guard that every boolean in a form
// schema is optional (an unchecked checkbox submits nothing). Re-declared so commander.form() keeps
// the same error kit's form() gives.
type IsAny<T> = 0 extends 1 & T ? true : false;
type HasNonOptionalBoolean<T> =
	IsAny<T> extends true
		? never
		: [T] extends [boolean]
			? true
			: T extends Array<infer U>
				? HasNonOptionalBoolean<U>
				: T extends Record<string, any>
					? { [K in keyof T]: HasNonOptionalBoolean<T[K]> }[keyof T]
					: never;
type FormSchemaGuard<TSchema extends StandardSchemaV1> =
	true extends HasNonOptionalBoolean<Input<TSchema>>
		? 'Error: All booleans in form schemas must be optional (e.g. `v.optional(v.boolean(), false)`) because checkbox inputs do not send a false value when unchecked.'
		: TSchema;

export type ProtectorWithoutSchema<TCtx> = (args: { event: RequestEvent }) => TCtx;
export type ProtectorWithSchema<TSchema extends StandardSchemaV1, TCtx> = (args: {
	event: RequestEvent;
	data: StandardSchemaV1.InferOutput<TSchema>;
}) => TCtx;

export type Protector<
	TSchema extends StandardSchemaV1 | undefined,
	TCtx
> = TSchema extends undefined
	? ProtectorWithoutSchema<TCtx>
	: ProtectorWithSchema<NonNullable<TSchema>, TCtx>;

export type ProtectedQuery<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => MaybePromise<TReturn>,
		fn?: undefined
	): RemoteQueryFunction<void, TReturn>;
	// Mirrors kit's query(schema, fn): the handler gets the validated output, while callers pass
	// the schema's input (they differ whenever the schema transforms, e.g. a string → number).
	<TSchema extends StandardSchemaV1, TReturn>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; params: Output<TSchema> }) => MaybePromise<TReturn>
	): RemoteQueryFunction<Input<TSchema>, TReturn, Output<TSchema>>;
};

export type ProtectedForm<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => MaybePromise<TReturn>,
		fn?: undefined
	): RemoteForm<void, TReturn>;
	// Mirrors kit's form(schema, fn), including its `issue` type: a proxy shaped like the schema's
	// input, so nested and array fields work (`issue.guardians[1].email('Taken')`).
	<TSchema extends StandardSchemaV1<RemoteFormInput, Record<string, any>>, TReturn>(
		schemaOrFn: FormSchemaGuard<TSchema>,
		fn: (args: {
			ctx: Awaited<TCtx>;
			data: Output<TSchema>;
			issue: RemoteFormInvalidField<Input<TSchema>>;
		}) => MaybePromise<TReturn>
	): RemoteForm<Input<TSchema>, TReturn>;
};

export type ProtectedCommand<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => MaybePromise<TReturn>,
		fn?: undefined
	): RemoteCommand<void, TReturn>;
	// Callers pass the schema's input; the handler gets the validated output.
	<TSchema extends StandardSchemaV1, TReturn>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; data: Output<TSchema> }) => MaybePromise<TReturn>
	): RemoteCommand<Input<TSchema>, TReturn>;
};
