import EBookController from '../controllers/eBookController';
import { assertDefined, HOST } from '../helpers/helpers';
import { wordProperty, wordStatus, wordType } from '../helpers/types';
import Pagination from '../helpers/pagination';
import ViewInterface from './viewInterface';
import UserController from '../controllers/userController';
import WordController from '../controllers/wordController';

class EbookView extends ViewInterface {
    group = 0;
    pagination: Pagination;
    eBookController: EBookController;
    userController: UserController;
    wordController: WordController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.eBookController = new EBookController();
        this.pagination = new Pagination();
        this.userController = UserController.getInstance();
        this.group = localStorage.getItem('group') !== undefined ? Number(localStorage.getItem('group')) : 0;
        this.wordController = WordController.getInstance();
    }

    async show(): Promise<void> {
        this.rootElement.innerText = '';
        const groups = this.getGroups();
        const pagination = this.pagination.getPagination(() => this.reDraw());
        this.rootElement.append(groups);
        this.rootElement.append(pagination);
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-container');
        let words: wordType[] | null = [];
        if (this.group === 6) {
            words = await this.eBookController.getHardWordsUser();
        } else {
            const words = this.userController.isSignin() ?
                await this.eBookController.getGroupWordsUser(this.group, this.pagination.page) :
                await this.eBookController.getGroupWords(this.group, this.pagination.page);
        }
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
        let words: wordType[] | null = [];
        if (this.group === 6) {
            words = await this.eBookController.getHardWordsUser();
        } else {
            words = this.userController.isSignin() ?
                await this.eBookController.getGroupWordsUser(this.group, this.pagination.page) :
                await this.eBookController.getGroupWords(this.group, this.pagination.page);
        }
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
        if (this.userController.isSignin()) {
            const li = document.createElement('li');
            li.textContent = `Сложные слова`;
            li.classList.add('group-list__group');
            if (this.group === 6) li.classList.add('active-group');
            li.dataset.group = `6`;
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

            ul.append(li);
        }
        return ul;
    }

    getWordCard(word: wordType, template: HTMLDivElement): HTMLElement {
        const wordCard = template;
        const card = assertDefined(wordCard.querySelector('.word-card')) as HTMLDivElement;
        card.classList.add(`group${this.group}`);
        card.dataset.cardId = word._id === undefined ? word.id : word._id;
        const audioBtn = assertDefined(wordCard.querySelector('#audioBtn')) as HTMLButtonElement;
        this.addAudioAction(word.audio, word.audioMeaning, word.audioExample, audioBtn);
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
        const markHard = assertDefined(wordCard.querySelector('#hardMark')) as HTMLButtonElement;
        const learnedMark = assertDefined(wordCard.querySelector('#learnedMark')) as HTMLButtonElement;

        if (this.userController.isSignin()) {
            if (word.userWord !== undefined) {
                if (word.userWord.difficulty === wordStatus.easy) learnedMark.disabled = true;
                card.classList.add(`word-card_${word.userWord.difficulty}`);
                markHard.disabled = true;
            }
            markHard.addEventListener('click', (ev) => this.markCard(ev, wordStatus.hard));
            learnedMark.addEventListener('click', (ev) => this.markCard(ev, wordStatus.easy));
        } else {
            markHard.remove();
            learnedMark.remove();
        }
        return wordCard;
    }
    private addAudioAction(audio: string, audioMeaning: string, audioExample: string, playBtn: HTMLButtonElement) {
        const wordAudio = new Audio();
        wordAudio.setAttribute('src', `${HOST}\\${audio}`);
        wordAudio.addEventListener('ended', (ev) => {
            var target = ev.target as HTMLAudioElement;
            var cur_src = target.getAttribute('src');
            switch (cur_src) {
                case `${HOST}\\${audio}`: target.setAttribute('src', `${HOST}\\${audioMeaning}`); break;
                case `${HOST}\\${audioMeaning}`: target.setAttribute('src', `${HOST}\\${audioExample}`); break;
                case `${HOST}\\${audioExample}`:
                    target.setAttribute('src', `${HOST}\\${audio}`);
                    this.togleAudioBtn(playBtn);
                    return;
            }
            target.play();
        })
        playBtn.addEventListener('click', (ev: Event) => {
            const target = ev.target as HTMLButtonElement;
            let currentAudio = wordAudio;
            if (target.classList.contains('word-action__audio_start')) {
                currentAudio.play();
                this.togleAudioBtn(playBtn)
            } else {
                currentAudio.pause();
                this.togleAudioBtn(playBtn);
            }
        });
    }
    private togleAudioBtn(target: HTMLButtonElement) {
        target.classList.toggle('word-action__audio_start');
        target.classList.toggle('word-action__audio_stop');
    }

    private async markCard(ev: Event, status: wordStatus) {
        const target = ev.target as HTMLButtonElement;
        const card = assertDefined(target.closest<HTMLElement>('.word-card'));
        const id = assertDefined(card.dataset.cardId);
        const wortUpdate: wordProperty = {
            difficulty: status,
            optional: {}
        }
        let group = this.group;
        if (status === wordStatus.hard) {
            const succesAction = () => {
                card.classList.add(`word-card_${status}`);
                target.disabled = true;
                console.log(group);
            }
            await this.wordController.addStatus(id, wortUpdate, succesAction);
        } else {
            const markHard = assertDefined(card.querySelector('#hardMark')) as HTMLButtonElement;
            const succesAction = () => {
                if (group === 6) {
                    card.remove();
                } else {
                    card.classList.remove(`word-card_${wordStatus.hard}`);
                    card.classList.add(`word-card_${status}`);
                    target.disabled = true;
                    markHard.disabled = true;
                };
            }
            if (card.classList.contains(`word-card_${wordStatus.hard}`)) {
                await this.wordController.updateStatus(id, wortUpdate, succesAction);
            } else {
                await this.wordController.addStatus(id, wortUpdate, succesAction);

            }
        }
    }
}

export default EbookView;
