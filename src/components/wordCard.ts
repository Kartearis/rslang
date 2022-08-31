import { wordType } from '../helpers/types';

import './result-word-card.css';
import { assertDefined, getHostPath } from '../helpers/helpers';
import AudioController from '../controllers/audioController';

const template = document.createElement('template');
template.innerHTML = `
    <button class="result-word-card__button"><span class='icon icon--sound icon--size-5'></span></button>
    <span class="result-word-card__word"></span>
    <span class="result-word-card__separator">-</span>
    <span class="result-word-card__translation"></span>
`;

export default class ResultWordCard extends HTMLElement {
    private word: wordType;
    private audio: AudioController;

    constructor(word: wordType) {
        super();
        this.word = word;
        this.classList.add('result-word-card');
        this.audio = new AudioController(getHostPath(this.word.audio)).setVolume(0.7);
        this.append(template.content.cloneNode(true));
        (assertDefined(this.querySelector('.result-word-card__word')) as HTMLElement).innerText = this.word.word;
        (assertDefined(
            this.querySelector('.result-word-card__translation')
        ) as HTMLElement).innerText = this.word.wordTranslate;
        assertDefined(this.querySelector('.result-word-card__button')).addEventListener('click', () =>
            this.audio.play()
        );
    }
}

customElements.define('result-word-card', ResultWordCard);
