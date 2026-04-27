import { v4 } from "uuid";
import { CSSProperty, illegalAttributes, Styles } from "./properties";

export class Component<T extends HTMLElement> {
    // basic
    protected element: T;
    get id(): string {
        return this.element.id;
    }

    // styles
    readonly componentStyles: Styles = [];

    // init
    constructor(element: T) {
        this.element = element;
        this.element.id = v4();
        this.setStyles(this.componentStyles);
    }

    // Render
    readonly appendTo = (parent: Component<any>|HTMLElement): void => {
        if (parent instanceof Component) {
            parent.element.append(this.element);
            return
        }
        parent.append(this.element);
    }
    
    readonly prependTo = (parent: Component<any>|HTMLElement): void => {
        if (parent instanceof Component) {
            parent.element.prepend(this.element);
            return
        }
        parent.prepend(this.element);
    }

    // Attributes
    readonly setAttribute = (attribute: string, value: string = ""): boolean => {
        if (illegalAttributes.includes(attribute))
            return false;

        this.element.setAttribute(attribute, value);
        return true;
    }

    readonly removeAttribute = (attribute: string): void => {
        this.element.removeAttribute(attribute);
    }

    // Style
    readonly setStyles = (styles: Styles): void => {
        // reset styles
        this.element.style.cssText = "";

        // set styles
        for (const style of styles) {
            const property: CSSProperty = style[0];
            const value: string = style[1];
            this.element.style.setProperty(property, value);
        }
    };
}