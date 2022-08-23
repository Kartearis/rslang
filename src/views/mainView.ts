import ViewInterface from './viewInterface';

export default class MainView extends ViewInterface {
    // constructor(rootElement: HTMLElement) {
    //     super(rootElement);
    // }

    show(): void {
        this.rootElement.innerHTML = mainBody;
    }
}

const mainBody = `<h1>RSLANG APP</h1><p>Take advantage of our bite-sized lessons so you can study at a time that's best for you. You'll only see exercises at the right level for you and can achieve certificates when you pass each level.</p>`;
