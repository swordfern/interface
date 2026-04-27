import { Component } from "./component";
import { Renderer } from "./renderer";

export enum InputComponentTypes {
    Input = "input",
    Textarea = "textarea",
}

export class InputComponent<T> extends Component {
    // init
    constructor(renderer: Renderer, type: InputComponentTypes, initialValue: T) {
        super(renderer, type);
        this._value = initialValue;
    }

    // specific
    private _value: T;
    get value(): T{
        return this._value;
    }
    set value(newValue: T) {
        this._value= newValue;
        this.renderer.updateComponent(this);
    }
}