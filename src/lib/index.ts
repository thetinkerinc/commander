import { query, form, command, getRequestEvent } from '$app/server';

import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RequestEvent } from '@sveltejs/kit';
import type { ProtectedQuery } from './types.ts';

function makeCommander<T extends StandardSchemaV1>(
	protect: (args: { event: RequestEvent; data?: StandardSchemaV1.InferOutput<T> }) => any
) {
	return {
		query: makeProtectedQuery(protect),
		form: makeProtectedForm(protect),
		command: makeProtectedCommand(protect)
	};
}

function makeProtectedQuery<
	TSchema extends Parameters<typeof query>[0],
	TReturn,
	TProtector extends (args: { event: RequestEvent; data?: TParams }) => any,
	TCtx = ReturnType<TProtector>,
	TParams = StandardSchemaV1.InferOutput<TSchema>
>(protect: TProtector): ProtectedQuery {
	return (
		schemaOrFn: TSchema | ((args: { ctx: TCtx }) => TReturn),
		fn?: (args: { ctx: TCtx; params: TParams }) => TReturn
	) => {
		if (typeof schemaOrFn === 'function') {
			return query(() => {
				const ctx: TCtx = protect({ event: getRequestEvent() });
				return schemaOrFn({ ctx });
			});
		}
		if (fn == null) {
			throw new Error('query with a schema needs to define a handler function');
		}
		return query(schemaOrFn, (params) => {
			const ctx: TCtx = protect({ event: getRequestEvent(), data: params as TParams });
			return fn({ ctx, params: params as TParams });
		});
	};
}

function makeProtectedForm<
	TSchema extends Parameters<typeof form>[0],
	TReturn,
	TProtector extends (args: { event: RequestEvent; data: TData }) => any,
	TCtx = ReturnType<TProtector>,
	TData = StandardSchemaV1.InferOutput<TSchema>
>(protect: TProtector) {
	return (schema: TSchema, fn: (args: { ctx: TCtx; data: TData }) => TReturn) => {
		return form(schema, (data) => {
			const ctx: TCtx = protect({ event: getRequestEvent(), data: data as TData });
			return fn({ ctx, data: data as TData });
		});
	};
}

function makeProtectedCommand<
	TSchema extends Parameters<typeof form>[0],
	TReturn,
	TProtector extends (args: { event: RequestEvent; data: TData }) => any,
	TCtx = ReturnType<TProtector>,
	TData = StandardSchemaV1.InferOutput<TSchema>
>(protect: TProtector) {
	return (schema: TSchema, fn: (args: { ctx: TCtx; data: TData }) => TReturn) => {
		return command(schema, (data) => {
			const ctx: TCtx = protect({ event: getRequestEvent(), data: data as TData });
			return fn({ ctx, data: data as TData });
		});
	};
}

export { makeCommander };
