import ViewInterface from './viewInterface';

export default class TestView extends ViewInterface {
    constructor(rootElement: HTMLElement) {
        super(rootElement);
    }

    show(): void {
        this.rootElement.innerText = 'Test';
    }
}
