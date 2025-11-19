import { query, form, command, getRequestEvent } from '$app/server';

import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Protector, ProtectedQuery, ProtectedForm, ProtectedCommand } from './types.ts';

function makeCommander<T extends StandardSchemaV1 | undefined = undefined>(protect: Protector<T>) {
	return {
		query: makeProtectedQuery(protect),
		form: makeProtectedForm(protect),
		command: makeProtectedCommand(protect)
	};
}

function makeProtectedQuery(protect: any): ProtectedQuery {
	return (schemaOrFn: any, fn?: any) => {
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
	};
}

function makeProtectedForm(protect: any): ProtectedForm {
	return (schemaOrFn: any, fn?: any) => {
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
	};
}

function makeProtectedCommand(protect: any): ProtectedCommand {
	return (schemaOrFn: any, fn?: any) => {
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
	};
}

export { makeCommander };
