import ViewInterface from './viewInterface';
import './sprint-game.css';
import Timer from "../components/timer";
import {assertDefined} from "../helpers/helpers";

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
            <div class="sprint-game__combo-counter">2</div>
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

export default class SprintGameView extends ViewInterface {
    private timer: Timer | null = null

    show(): void {
        this.rootElement.append(template.content.cloneNode(true));
        const timerContainer = assertDefined(this.rootElement.querySelector('.sprint-game__timer-container'));
        this.timer = new Timer(60);
        timerContainer.append(this.timer);
        this.timer.startTimer();
    }
}
