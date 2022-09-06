// View interface
// For some reason ts cannot use ViewInterface and requires ViewConstructor to support inheritance
export interface ViewConstructor {
    new (rootElement: HTMLElement, data: null | unknown): ViewInterface;
}

export default abstract class ViewInterface {
    rootElement: HTMLElement;
    auxData: unknown;

    // It is possible to provide data to view
    constructor(rootElement: HTMLElement, data: null | unknown = null) {
        this.rootElement = rootElement;
        this.auxData = data;
    }

    abstract show(): void;

    destroy(): void {
        // This method is empty by default
        // Should be overridden if something in view need finalizing
        // Called e.g. on router exit and should finalize everything (remove listeners, stop timers, etc)
    }
}
