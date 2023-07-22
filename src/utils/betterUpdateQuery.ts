
import { QueryInput, Cache } from "@urql/exchange-graphcache";
import { Query } from "../generated/graphql.tsx/graphql";

export function betterUpdateQuery(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: any, q: Query) => Query
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
