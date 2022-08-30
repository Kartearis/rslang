// Timer component with 1 second resolution
import './timer.css';

export default class Timer extends HTMLElement {
    private timeStages: number[];
    private timeLimit: number;
    private currentTime = 0;
    private timerId: number | null = null;

    constructor(timeLimit: number, timeStages: number[] = []) {
        super();
        this.timeStages = timeStages;
        this.timeLimit = timeLimit;
        this.classList.add('timer');
        this.innerText = this.currentTime.toString();
    }

    setTimeStages(stages: number[]): void {
        this.timeStages = stages;
    }

    startTimer(): void {
        this.stopTimer();
        this.currentTime = this.timeLimit;
        this.redraw();
        this.timerId = window.setInterval(() => this.timerTick(), 1000);
    }

    redraw() {
        this.innerText = this.currentTime.toString();
        this.style.setProperty('--progress', (this.currentTime / this.timeLimit - 0.1) * 100 + '%');
    }

    timerTick() {
        this.currentTime -= 1;
        if (this.timeStages.includes(this.currentTime)) this.emitTimeStage(this.currentTime);
        if (this.currentTime === 0) {
            this.emitTimeUp();
            this.stopTimer();
        }
        this.redraw();
    }

    stopTimer(): void {
        if (this.timerId) window.clearInterval(this.timerId);
        this.timerId = null;
    }

    protected emitTimeStage(currentTime: number): void {
        const event: CustomEvent<number> = new CustomEvent('timeStage', { detail: currentTime });
        this.dispatchEvent(event);
    }

    protected emitTimeUp(): void {
        const event: CustomEvent<void> = new CustomEvent('timeUp');
        this.dispatchEvent(event);
    }
}

customElements.define('game-timer', Timer);
