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
            if (this.group === i) li.classList.add('active-group');
            li.dataset.group = `${i}`;
            li.addEventListener('click', (ev: Event) => {
                const target = ev.target as HTMLButtonElement;
                this.group = Number(target.dataset.group);
                this.pagination.toFirstPage();
                localStorage.setItem('group', this.group.toString());
                assertDefined(document.querySelector('.active-group')).classList.remove('active-group');
                target.classList.add('active-group');
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
        assertDefined(wordCard.querySelector('.word-card')).classList.add(`group${this.group}`);
        const markHard = assertDefined(wordCard.querySelector('#hardMark')) as HTMLButtonElement;
        markHard.addEventListener('click', (ev) => this.markHard(ev));
        const audioBtn = assertDefined(wordCard.querySelector('#audioBtn')) as HTMLButtonElement;
        this.addAudioAction(word.audio, word.audioMeaning, word.audioExample, audioBtn);
        const learnedMark = assertDefined(wordCard.querySelector('#learnedMark')) as HTMLButtonElement;
        learnedMark.addEventListener('click', (ev) => this.markLearned(ev));
        const img = assertDefined(wordCard.querySelector('#wordImg')) as HTMLImageElement;
        img.src = `${HOST}\\${word.image}`;
        const wordInfo = assertDefined(wordCard.querySelector('#word')) as HTMLParagraphElement;
        wordInfo.innerText = `${word.word} ${word.transcription} - ${word.wordTranslate}`;
        const meaning = assertDefined(wordCard.querySelector('#meaning')) as HTMLParagraphElement;
        meaning.insertAdjacentHTML('afterbegin', word.textMeaning);
        const meaningTransalte = assertDefined(wordCard.querySelector('#meaningTransalte')) as HTMLParagraphElement;
        meaningTransalte.innerText = word.textMeaningTranslate;
        const example = assertDefined(wordCard.querySelector('#example')) as HTMLParagraphElement;
        example.insertAdjacentHTML('afterbegin', word.textExample);
        const exampleTransalte = assertDefined(wordCard.querySelector('#exampleTransalte')) as HTMLParagraphElement;
        exampleTransalte.innerText = word.textExampleTranslate;
        return wordCard;
    }
    private addAudioAction(audio: string, audioMeaning: string, audioExample: string, playBtn: HTMLButtonElement) {
        const wordAudio = new Audio();

        wordAudio.onended = function (e) {
            var target = e.target as HTMLAudioElement;
            var cur_src = target.getAttribute('src');
            switch (cur_src) {
                case `${HOST}\\${audio}`: target.setAttribute('src', `${HOST}\\${audioMeaning}`); break;
                case `${HOST}\\${audioMeaning}`: target.setAttribute('src', `${HOST}\\${audioExample}`); break;
                case `${HOST}\\${audioExample}`: target.setAttribute('src', `${HOST}\\${audio}`); break;
            }
            target.play();
        };
        wordAudio.setAttribute('src', `${HOST}\\${audio}`);

        playBtn.addEventListener('click', (ev: Event) => {
            const target = ev.target as HTMLButtonElement;
            let currentAudio = wordAudio;
            if (target.classList.contains('audio_start')) {
                currentAudio.play();
                this.togleAudioBtn(playBtn)
            } else {
                currentAudio.pause();
                this.togleAudioBtn(playBtn)
            }
        });
        // wordAudio.addEventListener('play', () => this.togleAudioBtn(playBtn));
        // wordAudio.addEventListener('pause', () => this.togleAudioBtn(playBtn));
    }
    private togleAudioBtn(target: HTMLButtonElement) {
        target.classList.toggle('audio_start');
        target.classList.toggle('audio_stop');
    }

    private markHard(ev: Event): void {
        if (localStorage.getItem('jwt') === null) {
            alert('Нужно авторизоватся');
            console.log(ev);
        }
    }

    private markLearned(ev: Event): void {
        if (localStorage.getItem('jwt') === null) {
            alert('Нужно авторизоватся');
            console.log(ev);
        }
    }
}

export default EbookView;
