import { v4 } from "uuid";
import { CSSProperty, illegalAttributes, Styles } from "./properties";
import { Renderer } from "./renderer";

// Type Definitions
export type ComponentTypes = keyof HTMLElementTagNameMap;

export enum RenderPositions {
    Leading,
    Trailing,
}

// Main
export class Component {
    // data
    readonly renderer: Renderer;

    readonly id: string;
    readonly type: ComponentTypes;
    readonly initialStyles: Styles = [];

    private readonly attributes = new Map<string, string>();
    private readonly styles = new Map<CSSProperty, string>();
    private readonly children: Component[] = [];

    // init
    constructor(renderer: Renderer, type: ComponentTypes) {
        this.renderer = renderer;

        this.id = v4();
        this.type = type;
        this.applyStyles(this.initialStyles);
    }

    // attributes
    setAttribute = (attribute: string, value: string): boolean => {
        if (illegalAttributes.includes(attribute)) return false;

        this.attributes.set(attribute, value);
        this.renderer.updateComponent(this);
        return true;
    };

    removeAttribute = (attribute: string): void => {
        this.attributes.delete(attribute);
        this.renderer.updateComponent(this);
    };

    getAttribute = (attribute: string): string | undefined => {
        return this.attributes.get(attribute);
    };

    listAttributes = (): [string, string][] => {
        return [...this.attributes.entries()];
    };

    // styles
    applyStyles = (styles: Styles): void => {
        for (const style of styles) {
            this.styles.set(...style);
        }
        this.renderer.updateComponent(this);
    };

    listStyles = (): [CSSProperty, string][] => {
        return [...this.styles.entries()];
    };

    // children
    addChild = (child: Component, position: RenderPositions): void => {
        switch (position) {
            case RenderPositions.Leading: {
                this.children.unshift(child);
                break;
            }
            case RenderPositions.Trailing: {
                this.children.push(child);
                break;
            }
        }

        this.renderer.renderComponent(child, this, position);
    };

    removeChild = (child: Component): void => {
        const childIndex = this.children.indexOf(child);
        if (childIndex == -1) return;
        this.children.splice(childIndex, 1);

        this.renderer.removeComponent(child);
    };

    getChildComponents = (): Component[] => {
        return [...this.children];
    };
}
