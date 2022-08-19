// View interface
// For some reason ts cannot use ViewInterface and requires ViewConstructor to support inheritance
export interface ViewConstructor {
    new (rootElement: HTMLElement): ViewInterface;
}

export default abstract class ViewInterface {
    rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
    }

    abstract show(): void;
}
