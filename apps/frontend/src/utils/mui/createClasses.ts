type DecoratorParam<T extends string> = string[];

type ElementsParam<T extends string> = Record<string, string[]>;

type ReturnType<Elements extends Record<string, readonly string[]>> = {
  [Property in keyof Elements]: Decorators<Elements[Property]>;
};

type Decorators<Decorators extends readonly string[]> = {
  [K in Decorators[number]]: string;
};

export function createClasses<
  Elements extends Record<string, readonly string[]>,
>(elements: Elements): ReturnType<Elements> {
  throw "Unimplemented";
}

const a = ["hello", "world"] as const;
type Test = Decorators<typeof a>;
