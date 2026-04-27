import { Component } from "./component";
import { Renderer } from "../core/renderer";

export enum TextComponentTypes {
    Paragraph = "p",
    Span = "span",
    Label = "label",

    PrimaryHeadline = "h1",
    SecondaryHeadline = "h2",
}

export class TextComponent extends Component {
    // init
    constructor(renderer: Renderer, type: TextComponentTypes) {
        super(renderer, type);
    }

    // specific
    private _textContent: string = "";
    get textContent(): string {
        return this._textContent;
    }
    set textContent(newValue: string) {
        this._textContent = newValue;
        this.renderer.updateComponent(this);
    }
}