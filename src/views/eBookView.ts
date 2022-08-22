import EBookController from '../controllers/eBookController';
import { assertDefined, HOST } from '../helpers/helpers';
import { wordType } from '../helpers/types';
import Pagination from '../helpers/pagination';
import ViewInterface from './viewInterface';

class EbookView extends ViewInterface {
    group = 0;
    pagination: Pagination;
    eBookController: EBookController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.eBookController = new EBookController();
        this.pagination = new Pagination();
        this.group = sessionStorage.getItem('group') !== undefined ? Number(sessionStorage.getItem('group')) : 0;
    }

    async show(): Promise<void> {
        this.rootElement.innerText = '';
        const groups = this.getGroups();
        const pagination = this.pagination.getPagination(() => this.reDraw());
        this.rootElement.append(groups);
        this.rootElement.append(pagination);
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-container');
        bookContainer.classList.add(`group${this.group}`);
        const words = await this.eBookController.getGroupWords(this.group, this.pagination.page);
        const template = assertDefined(document.querySelector<HTMLTemplateElement>('#wordCardTemplate'));

        if (words !== null) {
            words.forEach((w) => {
                const clone = template.content.cloneNode(true) as HTMLDivElement;
                const wordCard = this.getWordCard(w, clone);
                bookContainer.append(wordCard);
            });
        }

        this.rootElement.append(bookContainer);
    }

    async reDraw() {
        assertDefined(document.querySelector('.ebook-container')).remove();
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-container');
        bookContainer.classList.add(`group${this.group}`);
        const words = await this.eBookController.getGroupWords(this.group, this.pagination.page);
        const template = assertDefined(document.querySelector<HTMLTemplateElement>('#wordCardTemplate'));

        if (words !== null) {
            words.forEach((w) => {
                const clone = template.content.cloneNode(true) as HTMLDivElement;
                const wordBlock = this.getWordCard(w, clone);
                bookContainer.append(wordBlock);
            });
        }
        this.rootElement.append(bookContainer);
    }

    getGroups(): HTMLUListElement {
        const MAX_GROUP = 6;
        const ul = document.createElement('ul');
        ul.classList.add('group-list');
        for (let i = 0; i < MAX_GROUP; i++) {
            const li = document.createElement('li');
            li.textContent = `ГРУППА ${i + 1}`;
            li.classList.add('group-list__group');
            li.dataset.group = `${i}`;
            li.addEventListener('click', (ev: Event) => {
                const target = ev.target as HTMLButtonElement;
                this.group = Number(target.dataset.group);
                this.pagination.toFirstPage();
                localStorage.setItem('group', this.group.toString());

                this.reDraw();
            });
            ul.append(li);
        }
        const li = document.createElement('li');
        li.textContent = `Сложные слова`;
        li.classList.add('group-list__group');
        ul.append(li);
        return ul;
    }

    getWordCard(word: wordType, template: HTMLDivElement): HTMLElement {
        const wordCard = template;
        wordCard.id = word.id;
        const markHard = assertDefined(wordCard.querySelector('#hardMark')) as HTMLButtonElement;
        markHard.addEventListener('click', (ev) => this.markHard(ev));
        const img = assertDefined(wordCard.querySelector('#wordImg')) as HTMLImageElement;
        img.src = `${HOST}\\${word.image}`;
        const wordAudio = assertDefined(wordCard.querySelector('#wordAudio')) as HTMLAudioElement;
        wordAudio.src = `${HOST}\\${word.audio}`;
        wordAudio.style.display = 'none';
        const audioBtn = assertDefined(wordCard.querySelector('#audioBtn')) as HTMLButtonElement;
        this.addAudioAction(wordAudio, audioBtn);
        const wordInfo = assertDefined(wordCard.querySelector('#word')) as HTMLParagraphElement;
        wordInfo.innerText = `${word.word} ${word.transcription} - ${word.wordTranslate}`;
        const audioMeaning = assertDefined(wordCard.querySelector('#audioMeaning')) as HTMLAudioElement;
        audioMeaning.src = `${HOST}\\${word.audioMeaning}`;
        audioMeaning.style.display = 'none';
        const audioMeaningBtn = assertDefined(wordCard.querySelector('#audioMeaningBtn')) as HTMLButtonElement;
        this.addAudioAction(audioMeaning, audioMeaningBtn);
        const meaning = assertDefined(wordCard.querySelector('#meaning')) as HTMLParagraphElement;
        meaning.insertAdjacentHTML('afterbegin', word.textMeaning);
        const meaningTransalte = assertDefined(wordCard.querySelector('#meaningTransalte')) as HTMLParagraphElement;
        meaningTransalte.innerText = word.textMeaningTranslate;
        const audioExample = assertDefined(wordCard.querySelector('#audioExample')) as HTMLAudioElement;
        audioExample.src = `${HOST}\\${word.audioExample}`;
        audioExample.style.display = 'none';
        const audioExampleBtn = assertDefined(wordCard.querySelector('#audioExampleBtn')) as HTMLButtonElement;
        this.addAudioAction(audioExample, audioExampleBtn);
        const example = assertDefined(wordCard.querySelector('#example')) as HTMLParagraphElement;
        example.insertAdjacentHTML('afterbegin', word.textExample);
        const exampleTransalte = assertDefined(wordCard.querySelector('#exampleTransalte')) as HTMLParagraphElement;
        exampleTransalte.innerText = word.textExampleTranslate;
        return wordCard;
    }
    private addAudioAction(audio: HTMLAudioElement, playBtn: HTMLButtonElement) {
        playBtn.addEventListener('click', (ev: Event) => {
            const target = ev.target as HTMLButtonElement;
            if (target.classList.contains('audio_start')) {
                audio.play();
            } else {
                audio.pause();
            }
        });
        audio.addEventListener('play', () => this.togleAudioBtn(playBtn));
        audio.addEventListener('pause', () => this.togleAudioBtn(playBtn));
    }
    private togleAudioBtn(target: HTMLButtonElement) {
        target.classList.toggle('audio_start');
        target.classList.toggle('audio_stop');
    }

    markHard(ev: Event): void {
        if (localStorage.getItem('jwt') === null) {
            alert('Нужно авторизоватся');
            console.log(ev);
        }
    }
}

export default EbookView;
