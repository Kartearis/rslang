import EBookController from '../controllers/eBookController';
import { assertDefined, HARD_WORD_PAGE_NUM, HOST } from '../helpers/helpers';
import { wordProperty, wordStatus, wordType } from '../helpers/types';
import Pagination from '../helpers/pagination';
import ViewInterface from './viewInterface';
import UserController from '../controllers/userController';
import UserWordController from '../controllers/wordController';
import './eBook.css';
class EbookView extends ViewInterface {
    group = 0;
    pagination: Pagination;
    eBookController: EBookController;
    userController: UserController;
    wordController: UserWordController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.eBookController = EBookController.getInstance();
        this.pagination = new Pagination(async () => await this.reDraw());
        this.userController = UserController.getInstance();
        this.group = localStorage.getItem('group') !== undefined ? Number(localStorage.getItem('group')) : 0;
        this.wordController = UserWordController.getInstance();
    }

    async show(): Promise<void> {
        this.rootElement.innerText = '';
        const groups = this.getGroups();
        const pagination = this.pagination.getPagination();
        this.rootElement.append(groups);
        this.rootElement.append(await pagination);
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-container');
        let words: wordType[] | null = [];
        if (this.group === HARD_WORD_PAGE_NUM) {
            words = await this.eBookController.getHardWordsUser();
        } else {
            words = this.userController.isSignin()
                ? await this.eBookController.getWordsUserOnPage(this.group, this.pagination.page)
                : await this.eBookController.getGroupWords(this.group, this.pagination.page);
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
        if (this.group === HARD_WORD_PAGE_NUM) {
            words = await this.eBookController.getHardWordsUser();
        } else {
            words = this.userController.isSignin()
                ? await this.eBookController.getWordsUserOnPage(this.group, this.pagination.page)
                : await this.eBookController.getGroupWords(this.group, this.pagination.page);
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
            const li = this.getGroupLi(`ГРУППА ${i + 1}`, i);
            ul.append(li);
        }
        if (this.userController.isSignin()) {
            const li = this.getGroupLi(`Сложные слова`, HARD_WORD_PAGE_NUM);
            ul.append(li);
        }
        return ul;
    }
    private getGroupLi(groupName: string, groupNum: number): HTMLLIElement {
        const li = document.createElement('li');
        li.textContent = groupName;
        li.classList.add('group-list__group');
        if (this.group === groupNum) li.classList.add('group-list__group_active');
        li.dataset.group = groupNum.toString();
        li.addEventListener('click', (ev: Event) => {
            const target = ev.target as HTMLButtonElement;
            this.group = Number(target.dataset.group);
            localStorage.setItem('group', this.group.toString());

            this.pagination.toFirstPage(this.group);
            assertDefined(document.querySelector('.group-list__group_active')).classList.remove(
                'group-list__group_active'
            );
            target.classList.add('group-list__group_active');
            this.reDraw();
        });
        return li;
    }
    private getWordCard(word: wordType, template: HTMLDivElement): HTMLElement {
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
            const target = ev.target as HTMLAudioElement;
            const cur_src = target.getAttribute('src');
            switch (cur_src) {
                case `${HOST}\\${audio}`:
                    target.setAttribute('src', `${HOST}\\${audioMeaning}`);
                    break;
                case `${HOST}\\${audioMeaning}`:
                    target.setAttribute('src', `${HOST}\\${audioExample}`);
                    break;
                case `${HOST}\\${audioExample}`:
                    target.setAttribute('src', `${HOST}\\${audio}`);
                    this.togleAudioBtn(playBtn);
                    return;
            }
            target.play();
        });
        playBtn.addEventListener('click', (ev: Event) => {
            const target = ev.target as HTMLButtonElement;
            const currentAudio = wordAudio;
            if (target.classList.contains('word-action__audio_start')) {
                currentAudio.play();
                this.togleAudioBtn(playBtn);
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
            optional: {},
        };
        const group = this.group;
        if (status === wordStatus.hard) {
            const succesAction = () => {
                card.classList.add(`word-card_${status}`);
                target.disabled = true;
            };
            await this.wordController.addUserWord(id, wortUpdate, succesAction);
        } else {
            const markHard = assertDefined(card.querySelector('#hardMark')) as HTMLButtonElement;
            const succesAction = () => {
                //if group is hard remove from page, else change style
                if (group === HARD_WORD_PAGE_NUM) {
                    card.remove();
                } else {
                    card.classList.remove(`word-card_${wordStatus.hard}`);
                    card.classList.add(`word-card_${status}`);
                    target.disabled = true;
                    markHard.disabled = true;
                }
            };
            //if word in hard group - change, else that new user word and create
            if (card.classList.contains(`word-card_${wordStatus.hard}`)) {
                await this.wordController.updateUserWord(id, wortUpdate, succesAction);
            } else {
                await this.wordController.addUserWord(id, wortUpdate, succesAction);
            }
        }
    }
}

export default EbookView;
