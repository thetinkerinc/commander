import { query, form, command, getRequestEvent } from '$app/server';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type {
	ProtectorWithSchema,
	ProtectorWithoutSchema,
	ProtectedQuery,
	ProtectedForm,
	ProtectedCommand,
	Commander
} from './types.ts';

export function makeCommander<TCtx>(protector: ProtectorWithoutSchema<TCtx>): Commander<TCtx>;
export function makeCommander<TSchema extends StandardSchemaV1, TCtx>(
	schema: TSchema,
	protector: ProtectorWithSchema<TSchema, TCtx>
): Commander<TCtx>;
export function makeCommander<TSchema extends StandardSchemaV1 | undefined, TCtx>(
	schemaOrProtector: TSchema | ProtectorWithoutSchema<TCtx>,
	protector?: ProtectorWithSchema<any, TCtx>
): Commander<TCtx> {
	if (typeof schemaOrProtector === 'function') {
		const protect = schemaOrProtector as ProtectorWithoutSchema<TCtx>;
		return {
			query: makeProtectedQuery<TCtx>(protect),
			form: makeProtectedForm<TCtx>(protect),
			command: makeProtectedCommand<TCtx>(protect)
		};
	}
	if (protector) {
		const protect = protector as ProtectorWithSchema<any, TCtx>;
		return {
			query: makeProtectedQuery<TCtx>(protect),
			form: makeProtectedForm<TCtx>(protect),
			command: makeProtectedCommand<TCtx>(protect)
		};
	}

	throw new Error('Invalid arguments to makeCommander');
}

function makeProtectedQuery<TCtx>(protect: any): ProtectedQuery<TCtx> {
	return ((schemaOrFn: any, fn?: any) => {
		if (typeof schemaOrFn === 'function') {
			return query(() => {
				const ctx = protect({ event: getRequestEvent() });
				return schemaOrFn({ ctx });
			});
		}
		if (fn == null) {
			throw new Error('query with a schema needs to define a handler function');
		}
		return query(schemaOrFn, (params) => {
			const ctx = protect({ event: getRequestEvent(), data: params });
			return fn({ ctx, params });
		});
	}) as ProtectedQuery<TCtx>;
}

function makeProtectedForm<TCtx>(protect: any): ProtectedForm<TCtx> {
	return ((schemaOrFn: any, fn?: any) => {
		if (typeof schemaOrFn === 'function') {
			return form(() => {
				const ctx = protect({ event: getRequestEvent() });
				return schemaOrFn({ ctx });
			});
		}
		if (fn == null) {
			throw new Error('form with a schema needs to define a handler function');
		}
		return form(schemaOrFn, (data) => {
			const ctx = protect({ event: getRequestEvent(), data });
			return fn({ ctx, data });
		});
	}) as ProtectedForm<TCtx>;
}

function makeProtectedCommand<TCtx>(protect: any): ProtectedCommand<TCtx> {
	return ((schemaOrFn: any, fn?: any) => {
		if (typeof schemaOrFn === 'function') {
			return command(() => {
				const ctx = protect({ event: getRequestEvent() });
				return schemaOrFn({ ctx });
			});
		}
		if (fn == null) {
			throw new Error('command with a schema needs to define a handler function');
		}
		return command(schemaOrFn, (data) => {
			const ctx = protect({ event: getRequestEvent(), data });
			return fn({ ctx, data });
		});
	}) as ProtectedCommand<TCtx>;
}
