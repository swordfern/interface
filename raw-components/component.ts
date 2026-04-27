import { v4 } from "uuid";
import { CSSProperty, illegalAttributes, Styles } from "../core/properties";
import { Renderer } from "../core/renderer";

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
    setAttribute = (attribute: string, value: string): typeof this => {
        if (illegalAttributes.includes(attribute)) return this;

        this.attributes.set(attribute, value);
        this.renderer.updateComponent(this);
        return this;
    };

    removeAttribute = (attribute: string): typeof this => {
        this.attributes.delete(attribute);
        this.renderer.updateComponent(this);
        return this;
    };

    getAttribute = (attribute: string): string | undefined => {
        return this.attributes.get(attribute);
    };

    listAttributes = (): [string, string][] => {
        return [...this.attributes.entries()];
    };

    // styles
    applyStyles = (styles: Styles): typeof this => {
        for (const style of styles) {
            this.styles.set(...style);
        }
        this.renderer.updateComponent(this);
        return this;
    };

    listStyles = (): [CSSProperty, string][] => {
        return [...this.styles.entries()];
    };

    // children
    addChild = (child: Component, position: RenderPositions): typeof this => {
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
        return this;
    };

    removeChild = (child: Component): typeof this => {
        const childIndex = this.children.indexOf(child);
        if (childIndex == -1) return this;
        this.children.splice(childIndex, 1);

        this.renderer.removeComponent(child);
        return this;
    };

    getChildComponents = (): Component[] => {
        return [...this.children];
    };
}
