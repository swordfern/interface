import { Component, RenderPositions } from "../raw-components/component";
import { InputComponent } from "../raw-components/inputComponents";
import { TextComponent } from "../raw-components/textComponents";

// Type Definitions
export type ClickAction = (component: Component, e: MouseEvent) => void;
export type KeyAction = (component: Component, e: KeyboardEvent) => void;
export type ChangeAction<T> = (component: Component, newValue: T) => void;

export class Renderer {
    // data
    readonly components = new Map<string, Component>();

    readonly clickActions = new Map<string, ClickAction>();
    readonly keyActions = new Map<string, KeyAction>();
    readonly changeActions = new Map<string, ChangeAction<any>>();

    // utility
    readonly getComponentById = (id: string): Component | undefined => {
        return this.components.get(id) ?? undefined;
    };

    private readonly registerComponent = (component: Component): void => {
        this.components.set(component.id, component);
    };

    // rendering
    readonly setRootComponent = (component: Component): void => {
        this.components.clear();
        this.registerComponent(component);
        this.reflectComponentAdded(component);
    };

    readonly renderComponent = (
        component: Component,
        parent: Component,
        position: RenderPositions = RenderPositions.Trailing,
    ): void => {
        this.registerComponent(component);
        this.reflectComponentAdded(component, parent, position);
        this.updateComponent(component);

        for (const child of component.getChildComponents()) {
            this.renderComponent(child, component);
        }
    };

    readonly removeComponent = (component: Component): void => {
        this.components.delete(component.id);
        this.reflectComponentRemoved(component);
    };

    // events
    readonly registerClickAction = (
        component: Component,
        fn: ClickAction,
    ): void => {
        this.clickActions.set(component.id, fn);
    };

    readonly registerKeyAction = (
        component: Component,
        fn: KeyAction,
    ): void => {
        this.keyActions.set(component.id, fn);
    };

    readonly registerChangeAction = <T>(
        component: InputComponent<T>,
        fn: ChangeAction<T>,
    ): void => {
        this.changeActions.set(component.id, fn);
    };

    readonly triggerClickAction = (
        component: Component,
        e: MouseEvent,
    ): void => {
        const fn = this.clickActions.get(component.id);
        if (!fn) return;
        fn(component, e);
    };

    readonly triggerKeyAction = (
        component: Component,
        e: KeyboardEvent,
    ): void => {
        const fn = this.keyActions.get(component.id);
        if (!fn) return;
        fn(component, e);
    };

    readonly triggerChangeAction = <T>(component: InputComponent<T>): void => {
        const fn = this.changeActions.get(component.id);
        if (!fn) return;
        fn(component, component.value);
    };

    // reflect
    protected readonly reflectComponentAdded = (
        component: Component,
        parent?: Component,
        position?: RenderPositions,
    ): void => { };

    protected readonly reflectComponentRemoved = (
        component: Component,
    ): void => { };

    readonly updateComponent = (component: Component): void => { };
}

// Main
export class DOMRenderer extends Renderer {
    // utility
    createElementForComponent = (component: Component): HTMLElement => {
        const element = document.createElement(component.type);
        element.id = component.id;

        // attributes + styles
        for (const attribute of component.listAttributes()) {
            element.setAttribute(...attribute);
        }
        for (const style of component.listStyles()) {
            element.style.setProperty(...style);
        }

        // events
        element.onclick = (e) => this.triggerClickAction(component, e);
        element.onkeydown = (e) => this.triggerKeyAction(component, e);
        if (component instanceof InputComponent) {
            element.oninput = () => {
                if ("value" in element) component.setValue(element.value);
                this.triggerChangeAction(component);
            };
        }

        return element;
    };

    getElementForComponent = (
        component: Component,
    ): HTMLElement | undefined => {
        return document.getElementById(component.id) ?? undefined;
    };

    unwrapElement = (component: Component): HTMLElement => {
        const element = this.getElementForComponent(component);
        if (element) return element;

        return this.createElementForComponent(component);
    };

    // reflect
    protected readonly reflectComponentAdded = (
        component: Component,
        parent?: Component,
        position: RenderPositions = RenderPositions.Trailing,
    ): void => {
        // get data
        const parentElement = parent
            ? this.unwrapElement(parent)
            : document.body;
        const componentElement = this.unwrapElement(component);
        console.log(parentElement, componentElement);

        // add
        switch (position) {
            case RenderPositions.Leading:
                parentElement.prepend(componentElement);
                break;
            case RenderPositions.Trailing:
                parentElement.append(componentElement);
                break;
        }
    };

    protected readonly reflectComponentRemoved = (
        component: Component,
    ): void => {
        const componentElement = this.unwrapElement(component);
        componentElement.remove();
    };

    readonly updateComponent = (component: Component): boolean => {
        const componentElement: HTMLElement | undefined =
            this.getElementForComponent(component);
        if (!componentElement) return false;

        // standard
        for (const attribute of component.listAttributes()) {
            componentElement.setAttribute(...attribute);
        }
        for (const style of component.listStyles()) {
            componentElement.style.setProperty(...style);
        }

        // text
        if (component instanceof TextComponent) {
            componentElement.innerText = component.textContent;
        }

        // value
        if (
            component instanceof InputComponent &&
            "value" in componentElement
        ) {
            componentElement.value = component.value;
        }

        return true;
    };
}
