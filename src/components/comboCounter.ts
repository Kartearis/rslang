// Timer component with 1 second resolution
import './comboCounter.css';
import { assertDefined } from '../helpers/helpers';

const template = document.createElement('template');
template.innerHTML = `
    <div class="combo-counter__progress"></div>
    <div class="combo-counter__combo"></div>
`;

export default class ComboCounter extends HTMLElement {
    private currentCombo = 0;
    private comboProgress = 0;
    private maxCombo: number;

    private progressElement: HTMLElement;
    private comboElement: HTMLElement;

    constructor(maxCombo = 4) {
        super();
        this.maxCombo = maxCombo;
        this.classList.add('combo-counter');
        this.append(template.content.cloneNode(true));
        this.progressElement = assertDefined(this.querySelector('.combo-counter__progress'));
        this.comboElement = assertDefined(this.querySelector('.combo-counter__combo'));
    }

    reset(): void {
        this.currentCombo = 0;
        this.comboProgress = 0;
        this.redraw();
    }

    up(): void {
        // Any combo increase logic may be implemented here
        if (this.currentCombo < this.maxCombo) {
            this.comboProgress += 1;
            if (this.comboProgress > 3) {
                this.currentCombo += 1;
                this.comboProgress = 0;
            }
            this.redraw();
        }
    }

    redraw(): void {
        this.comboElement.innerHTML = '';
        this.progressElement.innerHTML = '';
        for (let i = 0; i < this.comboProgress; i++) {
            const progressMark = document.createElement('div');
            progressMark.classList.add('combo-progress-mark');
            this.progressElement.append(progressMark);
        }
        for (let i = 0; i < this.currentCombo; i++) {
            const comboMark = document.createElement('div');
            comboMark.classList.add('combo-mark');
            this.comboElement.append(comboMark);
        }
        if (this.currentCombo >= this.maxCombo) {
            this.progressElement.append('MAX COMBO!');
        }
    }

    get combo(): number {
        return this.currentCombo;
    }
}

customElements.define('combo-counter', ComboCounter);
