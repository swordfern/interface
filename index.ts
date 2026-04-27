import { v4 } from "uuid";
import { CSSProperty, illegalAttributes, Styles } from "./properties";

export class UIComponent {
    // basic
    private element: HTMLElement;
    get id(): string {
        return this.element.id;
    }

    // styles
    readonly componentStyles: Styles = [];

    // init
    constructor(public tagName: keyof HTMLElementTagNameMap) {
        this.element = document.createElement(tagName);
        this.element.id = v4();
        this.setStyles(this.componentStyles);
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