import { wordType } from '../helpers/types';
import ViewInterface from './viewInterface';
import './audiocallView.css'
import { assertDefined } from '../helpers/helpers';
import audio from '../assets/audio.png';

const audiocallBlock = `
    <div class='audiocall__word-info word-info'>
        <button id="ascPlayBtn" class="audiocall__button audiocall__button_asc">]
            <img class="word-info__audio" id="playImg" src="${audio}" />
        </button>
        <div id="answer" class='word-info__answer answer hidden'>
            <img class="answer__img" id="answerImg" src="https://rs-lang-proj.herokuapp.com/files/01_0006.jpg" />    
            <button id="answerPlayBtn" class="audiocall__button audiocall__button_answer ">]
                <img class="word-info__audio" id="playImg" src="${audio}" />
            </button>
            <p id="responseWord" class="response__word"></p>
        </div>
    </div>
    <div id="words" class="audiocall__words "></div>
    <div class="audiocall__buttons">
        <button id="donkKnowBtn" class="audiocall__button audiocall__buttons_dont-know">ХЗ</button>
        <button id="nextBtn" class="audiocall__button audiocall__buttons_next">Next</button>
    </div>
`;
export default class AudiocallView extends ViewInterface {
    constructor(rootElement: HTMLElement) {
        super(rootElement);
    }

    show(): void {
        this.rootElement.innerText = 'Audio';
    }
    gameFromPage(words: wordType[]) {
        this.rootElement.innerText = '';
        const audocallDiv = document.createElement('div');
        audocallDiv.id = 'audiocall';
        audocallDiv.classList.add('audiocall');
        audocallDiv.innerHTML = audiocallBlock;
        const wordsDiv = assertDefined(audocallDiv.querySelector('#words'));
        for (let i = 0; i < 4; i += 1) {
            const btn = document.createElement('button');
            const answerMark = document.createElement('span');
            answerMark.classList.add('response__word_wrong');
            btn.append(answerMark);
            btn.innerHTML += words[i].wordTranslate;
            btn.classList.add('audiocall__button');
            btn.classList.add('audiocall__button_response');
            wordsDiv.append(btn);
        }
        this.rootElement.append(audocallDiv);
        // console.log(words);
    }

}