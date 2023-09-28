import { QueryKey, useQuery, FetchQueryOptions } from "@tanstack/react-query";
import {
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query/src/types";
import { rqc } from "src/lib/react-query/client";

interface BuildUseQueryHook<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  (
    args: BuildUseQueryArgs<TInput, TQueryFnData, TError, TData, TQueryKey>,
  ): UseQueryResult<TData, TError>;
}

type BuildUseQueryArgs<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = TInput extends void
  ? {
      options?: BuildQueryOptions<
        TInput,
        TQueryFnData,
        TError,
        TData,
        TQueryKey
      >;
    } | void
  : {
      input: TInput;
      options?: BuildQueryOptions<
        TInput,
        TQueryFnData,
        TError,
        TData,
        TQueryKey
      >;
    };

interface BuildQuery<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  (
    args: BuildQueryArgs<TInput, TQueryFnData, TError, TData, TQueryKey>,
  ): Promise<TData>;
}

type BuildQueryArgs<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = TInput extends void
  ? {
      options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
    } | void
  : {
      input: TInput;
      options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
    };

interface BuildSelect<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  (input: TInput): TData | undefined;
}

interface BuildSelectOrThrow<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  (input: TInput): TData;
}

type BuildQueryOptions<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>;

export function createProcedure<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: (input: TInput) => TQueryKey,
  queryFn: (input: TInput) => Promise<TData>,
): {
  queryKey: (input: TInput) => TQueryKey;
  useQuery: BuildUseQueryHook<TInput, TQueryFnData, TError, TData, TQueryKey>;
  query: BuildQuery<TInput, TQueryFnData, TError, TData, TQueryKey>;
  select: BuildSelect<TInput, TQueryFnData, TError, TData, TQueryKey>;
  selectOrThrow: BuildSelectOrThrow<
    TInput,
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >;
};

export function createProcedure<
  TInput extends unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: (input: TInput) => TQueryKey,
  queryFn: (input: TInput) => Promise<TQueryFnData>,
) {
  const useQueryHook: BuildUseQueryHook<
    TInput,
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  > = (args) => {
    const input = args ? args.input : undefined;
    const options = args ? args.options : undefined;

    const keys = queryKey(input as any);

    return useQuery<TQueryFnData, TError, TData, TQueryKey>(
      keys,
      () => queryFn(input as any),
      options,
    );
  };

  const query: BuildQuery<TInput, TQueryFnData, TError, TData, TQueryKey> = (
    args,
  ) => {
    const input = args ? args.input : undefined;
    const options = args ? args.options : undefined;

    const keys = queryKey(input as any);

    return rqc.fetchQuery(keys, () => queryFn(input as any), options);
  };

  const select: BuildSelect<TInput, TQueryFnData, TError, TData, TQueryKey> = (
    input: TInput,
  ) => {
    const keys = queryKey(input as any);

    return rqc.getQueryData<TData>(keys);
  };

  const selectOrThrow: BuildSelectOrThrow<
    TInput,
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  > = (input: TInput) => {
    const keys = queryKey(input as any);

    const data = rqc.getQueryData<TData>(keys);

    if (data === undefined) {
      throw new Error(`Cache not found: queryKey: ${JSON.stringify(keys)}`);
    }

    return data;
  };

  return {
    queryKey,
    useQuery: useQueryHook,
    query,
    select,
    selectOrThrow,
  };
}
