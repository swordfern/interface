import { Component } from "./component";
import { ChangeAction, Renderer } from "../core/renderer";

export enum InputComponentTypes {
    Input = "input",
    Textarea = "textarea",
    Dropdown = "select",
}

export class InputComponent<T> extends Component {
    // init
    constructor(
        renderer: Renderer,
        type: InputComponentTypes,
        initialValue: T,
    ) {
        super(renderer, type);
        this._value = initialValue;
    }

    // specific
    private _value: T;
    get value(): T {
        return this._value;
    }
    setValue = (newValue: T): typeof this => {
        this._value = newValue;
        this.renderer.updateComponent(this);
        return this;
    };

    // events
    setChangeAction = (fn: ChangeAction<T>): typeof this => {
        this.renderer.registerChangeAction(this, fn);
        return this;
    };

    triggerChangeAction = (): void => {
        this.renderer.triggerChangeAction(this);
    };
}
