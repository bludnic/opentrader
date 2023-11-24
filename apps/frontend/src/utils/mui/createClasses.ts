import kebabCase from "lodash/kebabCase";

type ElementsParam<T> = {
  [Element in keyof T]: {
    [Modifier in keyof T[Element]]: T[Element][Modifier];
  };
};

type ClassesBuilder<
  ComponentName extends string,
  Elements extends ElementsParam<Elements>,
> = {
  [ElementKey in keyof Elements]: {
    // classes.element("modifierName")
    <ModifierKey extends keyof Elements[ElementKey]>(
      modifier: ModifierKey,
    ): ElementKey extends string
      ? GenerateModifiers<
          ComponentName,
          ElementKey,
          Elements[ElementKey]
        >[ModifierKey]
      : never;

    // classes.element()
    (): ElementKey extends string
      ? BuildElementName<ComponentName, ElementKey>
      : never;

    // classes.element.toString()
    toString: () => ElementKey extends string
      ? `${ComponentName}-${CamelToKebabCase<ElementKey>}`
      : never;
  };
};

type GenerateModifiers<
  ComponentKey extends string,
  ElementKey extends string,
  Element,
> = {
  [ModifierKey in keyof Element]: ModifierKey extends string
    ? BuildModifierName<ComponentKey, ElementKey, ModifierKey>
    : never;
};

type BuildElementName<
  ComponentKey extends string,
  ElementKey extends string,
> = `${ComponentKey}-${CamelToKebabCase<ElementKey>}`;

type BuildModifierName<
  ComponentKey extends string,
  ElementKey extends string,
  ModifierKey extends string,
> = `${ComponentKey}-${CamelToKebabCase<ElementKey>}--${CamelToKebabCase<ModifierKey>}`;

export function createClasses<C extends string, E extends ElementsParam<E>>(
  componentName: C,
  elements: E,
): ClassesBuilder<C, E> {
  const result = {} as ClassesBuilder<C, E>;
  const elementsKeys = Object.keys(elements) as (keyof E)[];

  for (const elementKey of elementsKeys) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- it may be typed better, but it will require much more TS code that will affect the readability
    result[elementKey] = buildElement(
      componentName,
      elementKey as string,
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- see comment above
  }

  return result;
}

function buildElement(componentName: string, elementKey: string) {
  const buildElementName = () => `${componentName}-${kebabCase(elementKey)}`;
  const buildModifierName = (modifier: string) =>
    `${buildElementName()}--${modifier}`;

  const fn = (modifierKey?: string) => {
    if (modifierKey === undefined) {
      return buildElementName();
    }

    return buildModifierName(modifierKey);
  };

  fn.toString = (modifierKey?: string) => {
    return fn(modifierKey);
  };

  return fn;
}

/// TS helpers

// @source: https://stackoverflow.com/a/71825405
type CamelToKebabCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "-" : ""}${Lowercase<T>}${CamelToKebabCase<U>}`
  : S;
