// ATTRIBUTES
export const illegalAttributes = [
    "id", "class", "style",
]

// STYLES
export type CSSProperty = Exclude<
    Extract<
        keyof CSSStyleDeclaration, string>,
    | "length"
    | "parentRule"
    | "setProperty"
    | "getPropertyValue"
    | "removeProperty"
    | "item"
    | "cssText"
    | "cssFloat"
>;
export type Styles = [CSSProperty, string][];