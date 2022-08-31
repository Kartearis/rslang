import ViewInterface from '../viewInterface';
import './sprint-game.css';
import Timer from '../../components/timer';
import { assertDefined } from '../../helpers/helpers';
import ComboCounter from '../../components/comboCounter';
import SprintGameController, { SprintWord } from '../../controllers/sprintGameController';

const KEYCODE_WRONG = 'ArrowLeft',
    KEYCODE_RIGHT = 'ArrowRight';

const template = document.createElement('template');
template.innerHTML = `
    <div class="sprint-game">
        <div class="sprint-game__timer-container">
        </div>
        <div class="sprint-game__point-container">
            0
        </div>
        <div class="sprint-game__controls-container">
            <button class="game-button game-button--transparent" id="sprint-mute"><span class="icon icon--size-1 icon--volume"></span></button>
            <button class="game-button game-button--transparent" id="sprint-exit"><span class="icon icon--size-1 icon--cross"></span></button>
        </div>
        <div class="sprint-game__game">
            <div class="sprint-game__word-controls-container">
                <button class="game-button game-button--transparent" id="sprint-word-sound">
                    <span class="icon icon--size-2 icon--sound"></span>
                </button>
            </div>
            <div class="sprint-game__combo-container"></div>
            <div class="sprint-game__word-container">
                <div class="sprint-game__original-word">Cat</div>
                <div class="sprint-game__translation">Кот</div>
            </div>
            <div class="sprint-game__game-controls">
                <button class="game-button game-button--wide game-button--wrong">Wrong</button>
                <button class="game-button game-button--wide game-button--right">Right</button>
            </div>
        </div>
    </div>
`;

export default class SprintMainView extends ViewInterface {
    private timer: Timer;
    private comboCounter: ComboCounter;
    private wordContainer: HTMLElement | null = null;
    private translationContainer: HTMLElement | null = null;
    private pointsContainer: HTMLElement | null = null;
    private controller: SprintGameController;
    private registeredGlobalHandlers: { handler: (event: KeyboardEvent) => void; eventName: string }[] = [];

    constructor(rootElement: HTMLElement, timer: Timer, comboCounter: ComboCounter, controller: SprintGameController) {
        super(rootElement);
        this.timer = timer;
        this.comboCounter = comboCounter;
        this.controller = controller;
    }

    show(): void {
        this.rootElement.innerHTML = '';
        this.rootElement.append(template.content.cloneNode(true));
        const timerContainer = assertDefined(this.rootElement.querySelector('.sprint-game__timer-container'));
        timerContainer.append(this.timer);
        this.timer.startTimer();
        const comboContainer = assertDefined(this.rootElement.querySelector('.sprint-game__combo-container'));
        comboContainer.append(this.comboCounter);
        this.comboCounter.reset();
        const rightButton = assertDefined(this.rootElement.querySelector('.game-button--right'));
        rightButton.addEventListener('click', () => this.handleAnswer('right'));
        const wrongButton = assertDefined(this.rootElement.querySelector('.game-button--wrong'));
        wrongButton.addEventListener('click', () => this.handleAnswer('wrong'));
        this.wordContainer = this.rootElement.querySelector('.sprint-game__original-word');
        this.translationContainer = this.rootElement.querySelector('.sprint-game__translation');
        this.pointsContainer = this.rootElement.querySelector('.sprint-game__point-container');
        const muteButton = assertDefined(this.rootElement.querySelector('#sprint-mute'));
        const muteButtonIcon = muteButton.querySelector('.icon') as HTMLElement;
        if (this.controller.isMute()) {
            muteButtonIcon.classList.remove('icon--volume');
            muteButtonIcon.classList.add('icon--mute');
        }
        assertDefined(this.rootElement.querySelector('#sprint-word-sound')).addEventListener('click', () =>
            this.controller.playSound('word')
        );
        muteButton.addEventListener('click', () => {
            this.controller.toggleMute();
            if (this.controller.isMute()) {
                muteButtonIcon.classList.remove('icon--volume');
                muteButtonIcon.classList.add('icon--mute');
            } else {
                muteButtonIcon.classList.remove('icon--mute');
                muteButtonIcon.classList.add('icon--volume');
            }
        });
        assertDefined(this.rootElement.querySelector('#sprint-exit')).addEventListener('click', () =>
            this.controller.exit()
        );
        this.installGlobalHandlers();
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.code === KEYCODE_WRONG && !event.repeat) this.handleAnswer('wrong');
        if (event.code === KEYCODE_RIGHT && !event.repeat) this.handleAnswer('right');
    }

    installGlobalHandlers() {
        const downHandler = (event: KeyboardEvent) => this.handleKeyDown(event);
        document.addEventListener('keydown', downHandler);
        this.registeredGlobalHandlers.push({ eventName: 'keydown', handler: downHandler });
    }

    removeGlobalHandlers() {
        this.registeredGlobalHandlers.forEach((data) =>
            document.removeEventListener(data.eventName, data.handler as EventListener)
        );
    }

    handleAnswer(answer: 'wrong' | 'right'): void {
        this.controller.handleUserAnswer(
            answer,
            assertDefined(this.wordContainer).innerText,
            assertDefined(this.translationContainer).innerText
        );
    }

    updatePoints(points: number): void {
        assertDefined(this.pointsContainer).innerText = points.toString();
    }

    showNewWord(word: SprintWord): void {
        assertDefined(this.wordContainer).innerText = word.word;
        assertDefined(this.translationContainer).innerText = word.translation;
    }

    destroy() {
        this.removeGlobalHandlers();
        this.timer.stopTimer();
    }
}
