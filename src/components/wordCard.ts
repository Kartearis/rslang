import {wordType} from "../helpers/types";

import './result-word-card.css';
import {assertDefined} from "../helpers/helpers";

const template = document.createElement('template');
template.innerHTML = `
    <button class="result-word-card__button"><span class='icon icon--sound icon--size-5'></span></button>
    <span class="result-word-card__word"></span>
    <span class="result-word-card__separator">-</span>
    <span class="result-word-card__translation"></span>
`;

export default class ResultWordCard extends HTMLElement{
    private word: wordType

    constructor(word: wordType) {
        super();
        this.word = word;
        this.classList.add('result-word-card');
        this.append(template.content.cloneNode(true));
        (assertDefined(this.querySelector('.result-word-card__word')) as HTMLElement)
            .innerText = this.word.word;
        (assertDefined(this.querySelector('.result-word-card__translation')) as HTMLElement)
            .innerText = this.word.wordTranslate;

    }
}

customElements.define('result-word-card', ResultWordCard);