import { Component } from "./component";

export type TextElement = HTMLSpanElement;

export class TextComponent extends Component<TextElement> {
    constructor(tagName: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "label") {
        const element = document.createElement(tagName);
        super(element);
    }

    get innerText(): string {
        return this.element.innerText;
    }

    set innerText(newText: string) {
        this.element.innerText = newText;
    }
}