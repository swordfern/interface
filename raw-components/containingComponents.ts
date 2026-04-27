import { Component } from "./component";
import { Renderer } from "../core/renderer";

export enum ContainingComponentTypes {
    Generic = "div",
    Section = "section",

    Table = "table",
    TableHeader = "thead",
    TableBody = "tbody",
    TableRow = "tr",
    TableCell = "td",

    BulletList = "ul",
    OrderedList = "ol",
}

export class ContainingComponent extends Component {
    // init
    constructor(renderer: Renderer, type: ContainingComponentTypes) {
        super(renderer, type);
    }

    // specific
    private _textContent: string = "";
    get textContent(): string {
        return this._textContent;
    }
    setContent = (newValue: string): typeof this => {
        this._textContent = newValue;
        this.renderer.updateComponent(this);
        return this;
    };
}
