import ViewInterface from './viewInterface';
import SprintGameController from '../controllers/sprintGameController';
import { wordType } from '../helpers/types';
import { assertDefined } from '../helpers/helpers';

export default class SprintGameView extends ViewInterface {
    private controller: SprintGameController | null = null;

    show() {
        // Will throw if no data provided!
        const words: wordType[] = assertDefined(this.auxData) as wordType[];
        this.controller = new SprintGameController(this.rootElement, words);
        this.controller.showIntro();
        // this.controller.showResults();
    }

    destroy() {
        this.controller?.destroy();
    }
}
