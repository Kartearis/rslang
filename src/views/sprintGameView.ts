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
        
        </div>
        <div class="sprint-game__controls-container">
       
        </div>
        <div class="sprint-game__game">
            
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
