import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
  MutationFunction,
} from "@tanstack/react-query";

interface BuildUseMutationHook<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> {
  (
    args: BuildUseMutationArgs<TData, TError, TVariables, TContext>,
  ): UseMutationResult<TData, TError, TVariables, TContext>;
}

type BuildUseMutationArgs<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = {
  options?: BuildMutationOptions<TData, TError, TVariables, TContext>;
} | void;

type BuildMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn">;

interface BuildMutateFn<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> {
  (variables: TVariables): Promise<TData>;
}

export function createMutation<
  TInput = unknown,
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
): {
  useMutation: BuildUseMutationHook<TData, TError, TVariables, TContext>;
  mutate: BuildMutateFn<TData, TError, TVariables, TContext>;
};

export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(mutationFn: MutationFunction<TData, TVariables>) {
  const useMutationHook: BuildUseMutationHook<
    TData,
    TError,
    TVariables,
    TContext
  > = (args) => {
    const options = args ? args.options : undefined;

    return useMutation<TData, TError, TVariables, TContext>(
      mutationFn,
      options,
    );
  };

  const mutate: BuildMutateFn<TData, TError, TVariables, TContext> = (
    input,
  ) => {
    return mutationFn(input);
  };

  return {
    useMutation: useMutationHook,
    mutate,
  };
}
