import { query, form, command } from '$app/server';

import type { StandardSchemaV1 } from '@standard-schema/spec';
import type {
	RemoteQueryFunction,
	RemoteForm,
	RemoteFormInput,
	RemoteCommand,
	RequestEvent
} from '@sveltejs/kit';

export type ProtectorWithoutSchema = (args: { event: RequestEvent }) => any;
export type ProtectorWithSchema<TSchema extends StandardSchemaV1> = (args: {
	event: RequestEvent;
	data: StandardSchemaV1.InferOutput<TSchema>;
}) => any;
export type Protector<TSchema extends StandardSchemaV1 | undefined> = TSchema extends undefined
	? ProtectorWithoutSchema
	: ProtectorWithSchema<NonNullable<TSchema>>;

export type ProtectedQuery = {
	<TReturn, TProtector extends Protector<undefined>, TCtx = ReturnType<TProtector>>(
		schemaOrFn: (args: { ctx: TCtx }) => TReturn,
		fn?: undefined
	): RemoteQueryFunction<void, TReturn>;

	<
		TSchema extends Parameters<typeof query>[0],
		TReturn,
		TProtector extends Protector<TSchema>,
		TCtx = ReturnType<TProtector>,
		TParams = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn?: (args: { ctx: TCtx; params: TParams }) => TReturn
	): RemoteQueryFunction<TParams, TReturn>;
};

export type ProtectedForm = {
	<TReturn, TProtector extends Protector<undefined>, TCtx = ReturnType<TProtector>>(
		schemaOrFn: (args: { ctx: TCtx }) => TReturn,
		fn?: undefined
	): RemoteForm<void, TReturn>;

	<
		TInput extends RemoteFormInput,
		TSchema extends Parameters<typeof form>[0],
		TReturn,
		TProtector extends Protector<TSchema>,
		TCtx = ReturnType<TProtector>,
		TData = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn?: (args: { ctx: TCtx; data: TData }) => TReturn
	): RemoteForm<TInput, TReturn>;
};

export type ProtectedCommand = {
	<TReturn, TProtector extends Protector<undefined>, TCtx = ReturnType<TProtector>>(
		schemaOrFn: (args: { ctx: TCtx }) => TReturn,
		fn?: undefined
	): RemoteCommand<void, TReturn>;

	<
		TSchema extends Parameters<typeof command>[0],
		TReturn,
		TProtector extends Protector<TSchema>,
		TCtx = ReturnType<TProtector>,
		TData = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn?: (args: { ctx: TCtx; data: TData }) => TReturn
	): RemoteCommand<TData, TReturn>;
};
