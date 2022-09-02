import ViewInterface from '../viewInterface';
import { wordGame } from '../../helpers/types';

import './sprint-outro.css';
import ResultWordCard from '../../components/resultWordCard';
import { assertDefined } from '../../helpers/helpers';
import GameController from '../../controllers/gameController';

const template = document.createElement('template');
template.innerHTML = `
    <div class = "sprint-outro">
        <h3 class="sprint-outro__header">Твой результат: <span class="sprint-outro__sub" id="outro-points">0</span> очков</h3>
        <div class="sprint-outro__word-stats">
            <div class="sprint-outro__stat-block" id="outro-errors">
                <h4 class="sprint-outro__stat-header sprint-outro__stat-header--error">Ошибки <span class="sprint-outro__sub" id="outro-error-cnt"></span></h4>
            </div>
            <div class="sprint-outro__stat-block" id="outro-correct">
                <h4 class="sprint-outro__stat-header sprint-outro__stat-header--correct">Верно <span class="sprint-outro__sub" id="outro-correct-cnt"></span></h4>
            </div>
        </div>
        <div class="sprint-outro__controls-container">
            <button class="outro-button" id="sprint-outro-continue">Продолжить</button>
            <button class="outro-button" id="sprint-outro-exit">Выйти</button>
        </div>
    </div>
`;

export default class SprintOutroView extends ViewInterface {
    private controller: GameController;
    private results: wordGame[];
    private errorContainer: HTMLElement | null = null;
    private correctContainer: HTMLElement | null = null;
    private correctCount = 0;
    private errorCount = 0;
    private points: number;

    constructor(rootElement: HTMLElement, controller: GameController, points: number, results: wordGame[]) {
        super(rootElement);
        this.controller = controller;
        this.results = results;
        this.points = points;
    }

    show() {
        this.rootElement.innerHTML = '';
        this.rootElement.append(template.content.cloneNode(true));
        this.errorContainer = this.rootElement.querySelector('#outro-errors');
        this.correctContainer = this.rootElement.querySelector('#outro-correct');
        this.results.forEach((word) => this.addToStats(word));
        const errorCnt = assertDefined(this.rootElement.querySelector('#outro-error-cnt')) as HTMLElement;
        const correctCnt = assertDefined(this.rootElement.querySelector('#outro-correct-cnt')) as HTMLElement;
        errorCnt.innerText = this.errorCount.toString();
        correctCnt.innerText = this.correctCount.toString();
        (assertDefined(
            this.rootElement.querySelector('#outro-points')
        ) as HTMLElement).innerText = this.points.toString();
        assertDefined(this.rootElement.querySelector('#sprint-outro-continue')).addEventListener('click', () =>
            this.controller.continue()
        );
        assertDefined(this.rootElement.querySelector('#sprint-outro-exit')).addEventListener('click', () =>
            this.controller.exit()
        );
    }

    addToStats(word: wordGame): void {
        const wordElement = new ResultWordCard(word.wordGame);
        if (word.result) {
            assertDefined(this.correctContainer).append(wordElement);
            this.correctCount++;
        } else {
            assertDefined(this.errorContainer).append(wordElement);
            this.errorCount++;
        }
    }
}
