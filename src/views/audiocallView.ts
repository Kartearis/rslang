import { audiocallWord, wordType } from '../helpers/types';
import ViewInterface from './viewInterface';
import './audiocallView.css';
import { assertDefined, HOST } from '../helpers/helpers';
import audioImg from '../assets/audio.png';
import AudiocallController from '../controllers/audiocallController';
// <button id="ascPlayBtn" class="audiocall-game__button audiocall-game__button_asc">
// <img class="word-info__audio" id="playImg" src="${audioImg}" />
// </button>
const audiocallBlock = `
    <button class="audiocall-game__button audiocall-game__button_exit" id="audiocall-exit">
        <span class="icon icon--size-1 icon--cross"></span>
    </button>
        <div id="response" class='response'>
            <img class="response__img hidden" id="responseImg" src="https://rs-lang-proj.herokuapp.com/files/01_0006.jpg" />    
           <div class="response__row">
            <button id="responsePlayBtn" class="audiocall-game__button response__audio_asc" >
                <img class="response__audio-img" id="responsePlayImg" src="${audioImg}" />
            </button>
            <p id="responseWord" class="response__word hidden" ></p>
           </div>
    </div>
    <div id="words" class="audiocall-game__options response-option"></div>
    <div class="audiocall-game__button">
        <button id="donkKnowBtn" class="audiocall-game__button audiocall-game__button_dont-know">Не знаю</button>
        <button id="nextBtn" class="audiocall-game__button audiocall-game__button_next hidden">→</button>
    </div>
`;
const audio = new Audio();
audio.autoplay = true;
class AudiocallView extends ViewInterface {
    controller: AudiocallController | null = null;
    show(): void {
        this.rootElement.innerText = 'Audio';
        const words: wordType[] = assertDefined(this.auxData) as wordType[];
        this.controller = new AudiocallController(this.rootElement, words);
        
        const options = this.controller.getResponseWords();
        this.rootElement.innerText = '';
        const audiocallDiv = document.createElement('div');
        audiocallDiv.id = 'audiocall';
        audiocallDiv.classList.add('audiocall-game');
        audiocallDiv.innerHTML = audiocallBlock;
        this.rootElement.append(audiocallDiv);
        assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#audiocall-exit')).addEventListener('click', () => this.controller?.exit());
        assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#nextBtn')).addEventListener('click', () => this.toNextWord());
        assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#donkKnowBtn')).addEventListener('click', () => this.dontKwonAnswer());
        this.fillPage(options);
    }

    private fillPage(words: audiocallWord[]): void {
        assertDefined(document.querySelector<HTMLDivElement>('#words')).innerText = '';
        words.forEach((wordForGame, i) => {
            const word = wordForGame.wordGame;
            const wordsDiv = assertDefined(document.querySelector('#words'));
            const responseMark = document.createElement('span');
            responseMark.classList.add('response-mark');
            responseMark.classList.add('hidden');
            wordForGame.right
                ? responseMark.classList.add('response__word_right')
                : responseMark.classList.add('response__word_wrong');
            const btn = document.createElement('button');
            btn.dataset.wirdId = word.id;
            btn.append(responseMark);
            btn.innerHTML += `<span class="option__num-key">${i+1}</span> ${word.wordTranslate}`;
            btn.classList.add('audiocall-game__button');
            btn.classList.add('option');
            btn.addEventListener('click', (ev: Event) => this.answer(ev));
            wordsDiv.append(btn);
            if (wordForGame.right) {
                assertDefined(document.querySelector<HTMLImageElement>('#responseImg')).src = `${HOST}/${word.image}`;
                assertDefined(document.querySelector('#responseWord')).innerHTML = word.word;
                const responsePlayBtn = assertDefined(document.querySelector<HTMLButtonElement>('#responsePlayBtn'));
                this.geAudio(`${HOST}/${word.audio}`);
                responsePlayBtn.addEventListener('click', () => audio.play());
            }
        });
    }
    private answer(ev:Event){
        const target = ev.target as HTMLButtonElement;
        const response = assertDefined(document.querySelector<HTMLDivElement>('#response'));
        if(target.classList.contains('response__word_right')) response.dataset.result = 'right';
        assertDefined(target.querySelector('.response-mark')).classList.toggle('hidden');
        this.togleAnswer();
        document.querySelectorAll<HTMLButtonElement>('.option').forEach((btn) => (btn.disabled = true));
    }
    private toNextWord(){
        const response  = assertDefined(document.querySelector<HTMLDivElement>('#response'));
        const res = response.dataset.result === undefined ? false : true;
        assertDefined(this.controller).rememberResult(res);
        const options = assertDefined(this.controller).getNextWord();
        this.togleAnswer();
        this.fillPage(options);
    }
    private dontKwonAnswer(){
        document.querySelectorAll<HTMLButtonElement>('.option').forEach((btn) => (btn.disabled = true));
        assertDefined(this.controller).rememberResult(false);
        const options = assertDefined(this.controller).getNextWord();
        this.togleAnswer();
    }

    private togleAnswer() {
        assertDefined(document.querySelector('#donkKnowBtn')).classList.toggle('hidden');
        assertDefined(document.querySelector('#nextBtn')).classList.toggle('hidden');
        // assertDefined(document.querySelector('#words')).classList.toggle('hidden');
        assertDefined(document.querySelector('#responseImg')).classList.toggle('hidden');
        assertDefined(document.querySelector('#responseWord')).classList.toggle('hidden');
        assertDefined(document.querySelector('#responsePlayBtn')).classList.toggle('response__audio');
        assertDefined(document.querySelector('#responsePlayBtn')).classList.toggle('response__audio_asc');
    }
    private geAudio(src: string) {
        audio.src = src;
        audio.load();
        const playImg = assertDefined(document.querySelector('#responsePlayImg'))
        audio.addEventListener('play', () => {
            playImg.classList.toggle('response__audio-img_play');
        });
        audio.addEventListener('pause', () => {
            playImg.classList.toggle('response__audio-img_play');
        });
    }
}

export default AudiocallView;
