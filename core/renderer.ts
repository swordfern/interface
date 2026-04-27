import { Component, RenderPositions } from "../raw-components/component";
import { InputComponent } from "../raw-components/inputComponents";
import { TextComponent } from "../raw-components/textComponents";

// Type Definitions
export class Renderer {
    // data
    readonly components = new Map<string, Component>();

    // utility
    readonly getComponentById = (id: string): Component | undefined => {
        return this.components.get(id) ?? undefined;
    };

    private readonly registerComponent = (component: Component): void => {
        this.components.set(component.id, component);
    };

    // methods
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

    // specific
    protected readonly reflectComponentAdded = (
        component: Component,
        parent?: Component,
        position?: RenderPositions,
    ): void => { };

    protected readonly reflectComponentRemoved = (
        component: Component,
    ): void => { };

    readonly updateComponent = (component: Component): void => {
    }
}

// Main
export class DOMRenderer extends Renderer {
    // utility
    createElementForComponent = (component: Component): HTMLElement => {
        const element = document.createElement(component.type);
        element.id = component.id;

        for (const attribute of component.listAttributes()) {
            element.setAttribute(...attribute);
        }
        for (const style of component.listStyles()) {
            element.style.setProperty(...style);
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

    // main
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
        const componentElement: HTMLElement | undefined = this.getElementForComponent(component);
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
        if (component instanceof InputComponent && "value" in componentElement) {
            componentElement.value = component.value;
        }

        return true
    }
}
