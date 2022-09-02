import { wordType } from '../helpers/types';
import ViewInterface from './viewInterface';

export default class AudiocallView extends ViewInterface {
    constructor(rootElement: HTMLElement) {
        super(rootElement);
    }

    show(): void {
        this.rootElement.innerText = 'Audio';
    }
    gameFromPage(words: wordType[]) {
        this.rootElement.innerText = '';
        console.log(words);
    }
}
