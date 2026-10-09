import type { RequestEvent } from '@sveltejs/kit';

import {
	query,
	command,
	type RemoteQueryFunction,
	type RemoteForm,
	type RemoteFormInput,
	type RemoteCommand
} from '$app/server';

import type { StandardSchemaV1 } from '@standard-schema/spec';

export type Commander<TCtx> = {
	query: ProtectedQuery<TCtx>;
	form: ProtectedForm<TCtx>;
	command: ProtectedCommand<TCtx>;
};

type IssueObject<TData> = {
	[K in keyof TData]: (message?: string) => StandardSchemaV1.Issue;
};

// Not exported from '@sveltejs/kit' (it's declared but unexported inside '$app/server''s own
// module augmentation), so re-declared here — needed so an async handler's `TReturn` infers as
// the awaited value (e.g. `{ success: boolean }`), not the raw `Promise<{ success: boolean }>`
// the function itself returns. Without this, `RemoteForm<TInput, TReturn>`'s `.result` ends up
// typed as a Promise, breaking direct access like `someForm.result?.success`.
type MaybePromise<T> = T | Promise<T>;

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
	<
		TSchema extends Parameters<typeof query>[0],
		TReturn,
		TParams = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; params: TParams }) => MaybePromise<TReturn>
	): RemoteQueryFunction<TParams, TReturn>;
};

export type ProtectedForm<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => MaybePromise<TReturn>,
		fn?: undefined
	): RemoteForm<void, TReturn>;
	<
		// form()'s own last overload's first parameter is a conditional type (a compile-time
		// "did you forget v.optional() on a boolean field" guard), unlike query()/command()'s
		// plain `Schema extends StandardSchemaV1`, so Parameters<typeof form>[0] resolves to
		// that conditional mess instead of a usable schema constraint — constrain directly
		// against StandardSchemaV1 instead of going through Parameters<typeof form> at all.
		TSchema extends StandardSchemaV1<RemoteFormInput, Record<string, any>>,
		TReturn,
		TData = StandardSchemaV1.InferOutput<TSchema>,
		TInput extends RemoteFormInput = StandardSchemaV1.InferInput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn: (args: {
			ctx: Awaited<TCtx>;
			data: TData;
			issue: IssueObject<TData>;
		}) => MaybePromise<TReturn>
	): RemoteForm<TInput, TReturn>;
};

export type ProtectedCommand<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => MaybePromise<TReturn>,
		fn?: undefined
	): RemoteCommand<void, TReturn>;
	<
		TSchema extends Parameters<typeof command>[0],
		TReturn,
		TData = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; data: TData }) => MaybePromise<TReturn>
	): RemoteCommand<TData, TReturn>;
};
