import { wordForGame, wordType } from '../helpers/types';
import ViewInterface from './viewInterface';
import './audiocallView.css'
import { assertDefined, HOST } from '../helpers/helpers';
import audio from '../assets/audio.png';
import AudiocallController from '../controllers/audiocallController';
const audiocallBlock = `
    <div class='audiocall__word-info word-info'>
        <button id="ascPlayBtn" class="audiocall__button audiocall__button_asc">
            <img class="word-info__audio" id="playImg" src="${audio}" />
        </button>
        <div id="response" class='word-info__response response hidden'>
            <img class="response__img" id="responseImg" src="https://rs-lang-proj.herokuapp.com/files/01_0006.jpg" />    
           <div class="response__word">
            <button id="responsePlayBtn" class="audiocall__button response__audio ">
                <img class="response__audio-img" id="responsePlayImg" src="${audio}" />
            </button>
            <p id="responseWord" class="response__word"></p>
           </div>
        </div>
    </div>
    <div id="words" class="audiocall__options response-option"></div>
    <div class="audiocall__buttons">
        <button id="donkKnowBtn" class="audiocall__button audiocall__buttons_dont-know">Не знаю</button>
        <button id="nextBtn" class="audiocall__button audiocall__buttons_next hidden">→</button>
    </div>
`;
class AudiocallView extends ViewInterface {
    audiocallController: AudiocallController = new AudiocallController([]);
    constructor(rootElement: HTMLElement) {
        super(rootElement);
    }

    show(): void {
        this.rootElement.innerText = 'Audio';
    }
    draw(words: wordType[]){
        this.audiocallController = new AudiocallController(words);
        const options = this.audiocallController.getResponseWords();
        this.rootElement.innerText = '';
        const audiocallDiv = document.createElement('div');
        audiocallDiv.id = 'audiocall';
        audiocallDiv.classList.add('audiocall');
        audiocallDiv.innerHTML = audiocallBlock;
        this.rootElement.append(audiocallDiv);
        assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#nextBtn')).addEventListener('click', () => {
            const rightBtn = assertDefined(document.querySelector('.response__word_right'));
            const res = !rightBtn.classList.contains('hidden');
            this.audiocallController.saveResult(res);
            const options = this.audiocallController.getNextWord();
            this.fillPage(options);
        });
        assertDefined(audiocallDiv.querySelector<HTMLButtonElement>('#donkKnowBtn')).addEventListener('click', () => {
            this.audiocallController.saveResult(false);
            const options = this.audiocallController.getNextWord();
            this.fillPage(options);
        });
        this.fillPage(options);
    }

    private fillPage(words: wordForGame[]): void{
        words.forEach(word => {
            const wordsDiv = assertDefined(document.querySelector('#words'));
            const responseMark = document.createElement('span');
            responseMark.classList.add('response-mark');
            responseMark.classList.add('hidden');
            const btn = document.createElement('button');
            btn.dataset.wirdId = word._id;
            btn.append(responseMark);
            btn.innerHTML += word.wordTranslate;
            btn.classList.add('audiocall__button');
            btn.classList.add('option');
            btn.addEventListener('click', (ev: Event) => {
                const target = ev.target as HTMLButtonElement;
                assertDefined(target.querySelector('.response-mark')).classList.toggle('hidden');
                this.toggleResponse();
                document.querySelectorAll<HTMLButtonElement>('.option').
                    forEach(btn => btn.disabled = true);
            });
            wordsDiv.append(btn);
            if(word.rigth){
                console.log(responseMark);
                responseMark.classList.add('response__word_right');
                assertDefined(document.querySelector('#responseWord')).innerHTML = word.word;
                const playImg = assertDefined(document.querySelector<HTMLImageElement>('#playImg'));
                const audio = this.geAudio(`${HOST}/${word.audio}`, playImg);
                const playBtn = assertDefined(document.querySelector<HTMLButtonElement>('#ascPlayBtn'));
                playBtn.addEventListener('click', () => {
                    audio.play();
                });
                const responsePlayBtn = assertDefined(document.querySelector<HTMLButtonElement>('#responsePlayBtn'));
                responsePlayBtn.addEventListener('click', () => {
                    audio.play();
                });
                audio.autoplay = true;
            } else {
                responseMark.classList.add('response__word_wrong');
            }
        })
    }
    private toggleResponse(){
        assertDefined(document.querySelector('#ascPlayBtn')).classList.toggle('hidden');
        assertDefined(document.querySelector('#response')).classList.toggle('hidden');
        assertDefined(document.querySelector('#donkKnowBtn')).classList.toggle('hidden');
        assertDefined(document.querySelector('#nextBtn')).classList.toggle('hidden');
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
}

export default AudiocallView;