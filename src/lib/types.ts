import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteQueryFunction, RequestEvent } from '@sveltejs/kit';

export type ProtectedQuery = {
	<TReturn, TProtector extends (event: RequestEvent) => any, TCtx = ReturnType<TProtector>>(
		schemaOrFn: (args: { ctx: TCtx }) => TReturn,
		fn?: undefined
	): RemoteQueryFunction<void, TReturn>;
	<
		TSchema extends Parameters<typeof query>[0],
		TReturn,
		TProtector extends (event: RequestEvent) => any,
		TCtx = ReturnType<TProtector>,
		TParams = StandardSchemaV1.InferOutput<TSchema>
	>(
		schemaOrFn: TSchema,
		fn?: (args: { ctx: TCtx; params: TParams }) => TReturn
	): RemoteQueryFunction<TParams, TReturn>;
};
