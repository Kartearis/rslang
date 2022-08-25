import { wordType } from '../helpers/types';
import ViewInterface from './viewInterface';
import './audiocallView.css'
import { assertDefined, HOST } from '../helpers/helpers';
import audio from '../assets/audio.png';
const COUNT_RESPONSE_WORD = 4;
const audiocallBlock = `
    <div class='audiocall__word-info word-info'>
        <button id="ascPlayBtn" class="audiocall__button audiocall__button_asc">
            <img class="word-info__audio" id="playImg" src="${audio}" />
        </button>
        <div id="answer" class='word-info__answer answer hidden'>
            <img class="answer__img" id="answerImg" src="https://rs-lang-proj.herokuapp.com/files/01_0006.jpg" />    
            <button id="answerPlayBtn" class="audiocall__button audiocall__button_answer ">]
                <img class="word-info__response-audio" id="responsePlayImg" src="${audio}" />
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
    words: wordType[] = [];
    constructor(rootElement: HTMLElement) {
        super(rootElement);
    }

    show(): void {
        this.rootElement.innerText = 'Audio';
    }
    gameFromPage(words: wordType[]) {
        this.words = this.shufleArray(words);
        const word = words[0];
        this.rootElement.innerText = '';
        const audiocallDiv = document.createElement('div');
        audiocallDiv.id = 'audiocall';
        audiocallDiv.classList.add('audiocall');
        audiocallDiv.innerHTML = audiocallBlock;
        const wordsDiv = assertDefined(audiocallDiv.querySelector('#words'));
        const playImg = assertDefined(audiocallDiv.querySelector<HTMLImageElement>('#playImg'));
        const audio = this.geAudio(`${HOST}/${word.audio}`, playImg);
        const playBtn = assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#ascPlayBtn'));
        playBtn.addEventListener('click', () => {
            audio.play();
        });
        const responsePlayImg = assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#responsePlayImg'));
        responsePlayImg.addEventListener('click', () => {
            audio.play();
        });
        audio.autoplay = true;
        const arrRandomSufledId = this.getRandomWordsId(0);
        for (let i = 0; i < COUNT_RESPONSE_WORD; i += 1) {
            const tmpId = arrRandomSufledId[i];
            const tmpWord = words[tmpId];

            const answerMark = document.createElement('span');
            answerMark.classList.add('response-mark');
            const responseMarkClass = 0 === tmpId ? 'response__word_right' : 'response__word_wrong';
            answerMark.classList.add(responseMarkClass);
            answerMark.classList.add('hidden');
            const btn = document.createElement('button');
            btn.dataset.wirdId = tmpWord._id;
            btn.append(answerMark);
            btn.innerHTML += tmpWord.wordTranslate;
            btn.classList.add('audiocall__button');
            btn.classList.add('audiocall__button_response');
            btn.addEventListener('click', (ev: Event) => {
                const target = ev.target as HTMLButtonElement;
                assertDefined(target.querySelector('.response-mark')).classList.toggle('hidden');
                document.querySelectorAll<HTMLButtonElement>('.audiocall__button_response').
                    forEach(btn => btn.disabled = true);
            });
            wordsDiv.append(btn);
        }
        this.rootElement.append(audiocallDiv);
    }
    private geAudio(src: string, playImg: HTMLImageElement): HTMLAudioElement {
        const audio = new Audio();
        audio.src = src;
        audio.addEventListener('play', () => {
            playImg.classList.toggle('word-info__audio_play');
        });
        audio.addEventListener('pause', () => {
            playImg.classList.toggle('word-info__audio_play');
        });
        return audio;
    }
    private getRandomWordsId(curentWordId: number): number[] {
        let arrId = [curentWordId];
        let testId = -1;
        while (arrId.length !== COUNT_RESPONSE_WORD) {
            testId = this.getRandomNum(this.words.length);
            if (!arrId.includes(testId)) {
                arrId.push(testId);
            }
        }
        const shufledArr = this.shufleArray(arrId);
        return shufledArr;
    }
    private shufleArray<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    private getRandomNum(max: number): number {
        return Math.floor(Math.random() * max)
    }
}