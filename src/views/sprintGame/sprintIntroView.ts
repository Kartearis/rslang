import ViewInterface from '../viewInterface';
import Timer from '../../components/timer';
import SprintGameController from '../../controllers/sprintGameController';
import { assertDefined } from '../../helpers/helpers';

import './sprint-intro.css';

const template = document.createElement('template');
template.innerHTML = `
    <div class = "sprint-intro">
        <div class="sprint-intro__controls-container">
            <button class="intro-button" id="sprint-intro-mute"><span class="icon icon--size-1 icon--volume"></span></button>
            <button class="intro-button" id="sprint-intro-exit"><span class="icon icon--size-1 icon--cross"></span></button>
        </div>
        <div class="sprint-intro__timer-container">
        </div>
        <div class="sprint-intro__motivation">
            Приготовились!
        </div>
    </div>
`;

export default class SprintIntroView extends ViewInterface {
    private timer: Timer;
    private controller: SprintGameController;

    constructor(rootElement: HTMLElement, controller: SprintGameController) {
        super(rootElement);
        this.timer = new Timer(5);
        this.timer.setTimeStages([4, 3, 2, 1, 0]);
        this.controller = controller;
        this.timer.addEventListener('timeStage', () => this.controller.playSound('ping'));
        this.timer.addEventListener('timeUp', () => this.controller.startGame());
    }

    show() {
        this.rootElement.innerHTML = '';
        this.rootElement.append(template.content.cloneNode(true));
        const timerContainer = assertDefined(this.rootElement.querySelector('.sprint-intro__timer-container'));
        timerContainer.append(this.timer);
        assertDefined(this.rootElement.querySelector('#sprint-intro-exit')).addEventListener('click', () => {
            this.timer.stopTimer();
            this.controller.exit();
        });
        const muteButtonIcon = assertDefined(this.rootElement.querySelector('#sprint-intro-mute .icon')) as HTMLElement;
        assertDefined(this.rootElement.querySelector('#sprint-intro-mute')).addEventListener('click', () => {
            this.controller.toggleMute();
            if (this.controller.isMute()) {
                muteButtonIcon.classList.remove('icon--volume');
                muteButtonIcon.classList.add('icon--mute');
            } else {
                muteButtonIcon.classList.remove('icon--mute');
                muteButtonIcon.classList.add('icon--volume');
            }
        });

        this.timer.startTimer();
    }

    destroy() {
        this.timer.stopTimer();
    }
}
