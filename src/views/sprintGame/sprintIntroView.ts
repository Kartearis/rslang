import ViewInterface from "../viewInterface";
import Timer from "../../components/timer";
import SprintGameController from "../../controllers/sprintGameController";
import {assertDefined} from "../../helpers/helpers";

import './sprint-intro.css';

const template = document.createElement('template');
template.innerHTML = `
    <div class = "sprint-intro">
        <div class="sprint-intro__controls-container">
            <button class="intro-button"><span class="icon icon--size-1 icon--cross"></span></button>
        </div>
        <div class="sprint-intro__timer-container">
        </div>
        <div class="sprint-intro__motivation">
            Приготовились!
        </div>
    </div>
`;

export default class SprintIntroView extends ViewInterface {
    private timer: Timer
    private controller: SprintGameController

    constructor(rootElement: HTMLElement, controller: SprintGameController) {
        super(rootElement);
        this.timer = new Timer(5);
        this.controller = controller;
    }


    show() {
        this.rootElement.innerHTML = "";
        this.rootElement.append(template.content.cloneNode(true));
        const timerContainer = assertDefined(this.rootElement.querySelector('.sprint-intro__timer-container'));
        timerContainer.append(this.timer);
        assertDefined(this.rootElement.querySelector('.intro-button'))
            .addEventListener('click', () => this.controller.exit());
        this.timer.addEventListener('timeUp', () => this.controller.startGame());
        this.timer.startTimer();
    }
}