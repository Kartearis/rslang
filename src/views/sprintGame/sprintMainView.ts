import ViewInterface from '../viewInterface';
import './sprint-game.css';
import Timer from "../../components/timer";
import {assertDefined} from "../../helpers/helpers";
import ComboCounter from "../../components/comboCounter";
import SprintGameController, {SprintWord} from "../../controllers/sprintGameController";

const template = document.createElement('template');
template.innerHTML = `
    <div class="sprint-game">
        <div class="sprint-game__timer-container">
        </div>
        <div class="sprint-game__point-container">
            0
        </div>
        <div class="sprint-game__controls-container">
            <button class="game-button game-button--transparent"><span class="icon icon--size-1 icon--mute"></span></button>
            <button class="game-button game-button--transparent"><span class="icon icon--size-1 icon--cross"></span></button>
        </div>
        <div class="sprint-game__game">
            <div class="sprint-game__word-controls-container">
                <button class="game-button game-button--transparent">
                    <span class="icon icon--size-1 icon--sound"></span>
                </button>
            </div>
            <div class="sprint-game__combo-container"></div>
            <div class="sprint-game__word-container">
                <div class="sprint-game__original-word">Cat</div>
                <div class="sprint-game__translation">Кот</div>
            </div>
            <div class="sprint-game__game-controls">
                <button data-answer="wrong" class="game-button game-button--wide game-button--wrong">Wrong</button>
                <button data-answer="right" class="game-button game-button--wide game-button--right">Right</button>
            </div>
        </div>
    </div>
`;

export default class SprintMainView extends ViewInterface {
    private timer: Timer
    private comboCounter: ComboCounter
    private wordContainer: HTMLElement | null = null
    private translationContainer: HTMLElement | null = null
    private pointsContainer: HTMLElement | null = null
    private controller: SprintGameController

    constructor(rootElement: HTMLElement, timer: Timer, comboCounter: ComboCounter, controller: SprintGameController) {
        super(rootElement);
        this.timer = timer;
        this.comboCounter = comboCounter;
        this.controller = controller;
    }

    show(): void {
        this.rootElement.innerHTML = "";
        this.rootElement.append(template.content.cloneNode(true));
        const timerContainer = assertDefined(this.rootElement.querySelector('.sprint-game__timer-container'));
        timerContainer.append(this.timer);
        this.timer.startTimer();
        const comboContainer = assertDefined(this.rootElement.querySelector('.sprint-game__combo-container'));
        comboContainer.append(this.comboCounter);
        this.comboCounter.reset();
        const rightButton = assertDefined(this.rootElement.querySelector('.game-button--right'));
        rightButton.addEventListener('click', () => this.handleAnswer("right"));
        const wrongButton = assertDefined(this.rootElement.querySelector('.game-button--wrong'));
        wrongButton.addEventListener('click', () => this.handleAnswer("wrong"));
        this.wordContainer = this.rootElement.querySelector('.sprint-game__original-word');
        this.translationContainer = this.rootElement.querySelector('.sprint-game__translation');
        this.pointsContainer = this.rootElement.querySelector('.sprint-game__point-container')
    }

    handleAnswer(answer: "wrong" | "right"): void {
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
}
