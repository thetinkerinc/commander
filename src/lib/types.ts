import { query, form, command } from '$app/server';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type {
	RemoteQueryFunction,
	RemoteForm,
	RemoteFormInput,
	RemoteCommand,
	RequestEvent
} from '@sveltejs/kit';

export type Commander<TCtx> = {
	query: ProtectedQuery<TCtx>;
	form: ProtectedForm<TCtx>;
	command: ProtectedCommand<TCtx>;
};

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
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => TReturn,
		fn?: undefined
	): RemoteQueryFunction<void, TReturn>;
	<
		TSchema extends Parameters<typeof query>[0],
		TReturn,
		TParams = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; params: TParams }) => TReturn
	): RemoteQueryFunction<TParams, TReturn>;
};

export type ProtectedForm<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => TReturn,
		fn?: undefined
	): RemoteForm<void, TReturn>;
	<
		TInput extends RemoteFormInput,
		TSchema extends Parameters<typeof form>[0],
		TReturn,
		TData = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; data: TData }) => TReturn
	): RemoteForm<TInput, TReturn>;
};

export type ProtectedCommand<TCtx> = {
	<TReturn>(
		schemaOrFn: (args: { ctx: Awaited<TCtx> }) => TReturn,
		fn?: undefined
	): RemoteCommand<void, TReturn>;
	<
		TSchema extends Parameters<typeof command>[0],
		TReturn,
		TData = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn: (args: { ctx: Awaited<TCtx>; data: TData }) => TReturn
	): RemoteCommand<TData, TReturn>;
};
