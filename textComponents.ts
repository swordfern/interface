import { Component } from "./component";

export class TextComponent extends Component {
    private _textContent: string = "";
    get textContent(): string {
        return this._textContent;
    }
    set textContent(newValue: string) {
        this._textContent = newValue;
        this.renderer.updateComponent(this);
    }
}