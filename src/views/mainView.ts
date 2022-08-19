import ViewInterface from './viewInterface';

export default class MainView extends ViewInterface {
    // constructor(rootElement: HTMLElement) {
    //     super(rootElement);
    // }

    show(): void {
        this.rootElement.innerText = 'Hello view';
    }
}
