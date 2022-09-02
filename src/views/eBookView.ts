import EBookController from '../controllers/eBookController';
import { assertDefined, HARD_WORD_GROUP_NUM, HOST, WORDS_ON_PAGE } from '../helpers/helpers';
import { wordProperty, wordStatus, wordType } from '../helpers/types';
import PaginationComponent from '../components/paginationComponent';
import ViewInterface from './viewInterface';
import UserController from '../controllers/userController';
import UserWordController from '../controllers/userWordController';
import './eBook.css';
import RouterController from '../controllers/routerController';
import audioImg from '../assets/audio.png';
// import AudiocallView from './audiocallView';

const template = `<div class="word-card" data-word-id="">
<div class="word-card__img-container">
    <img class="word-card__img" id="wordImg" src="https://rs-lang-proj.herokuapp.com/files/01_0006.jpg" />
</div>
<div class="word-card__info word-info">
    <p id="word"></p>
    <p class="word-info__meaning" id="meaning"></p>
    <p class="word-info__meaning_translate" id="meaningTransalte"></p>
    <p class="word-info__example" id="example"></p>
    <p class="word-info__example_translate" id="exampleTransalte"></p>
</div>
<div class="word-card__action word-action">
    <button id="hardMark" class="word-action__to-hard">!</button>
    <button id="learningMark" class="word-action__to-learning hidden">X</button>
    <button id="audioBtn" class="word-action__audio word-action__audio_start"><img src='${audioImg}' class="word-action__audio-img"/> </button>
    <button id="easyMark" class="word-action__to-easy">✓</button>
</div>
</div>`;

class EbookView extends ViewInterface {
    group = 0;
    pagination: PaginationComponent;
    eBookController: EBookController;
    userController: UserController;
    wordController: UserWordController;
    routerController: RouterController;
    words: wordType[] = [];
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.routerController = RouterController.getInstance();
        this.eBookController = EBookController.getInstance();
        this.pagination = new PaginationComponent(async () => await this.reDraw());
        this.userController = UserController.getInstance();
        this.wordController = UserWordController.getInstance();
        this.group = localStorage.getItem('group') !== undefined ? Number(localStorage.getItem('group')) : 0;
    }

    async show(): Promise<void> {
        this.words = await this.eBookController.getPageFromGroup(this.pagination.page, this.group);
        this.rootElement.innerText = '';
        const groups = await this.getGroups();
        const pagination = await this.pagination.getPagination();
        if (this.group === HARD_WORD_GROUP_NUM)
            pagination.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => (btn.disabled = true));
        const groupNavigation = document.createElement('div');
        groupNavigation.classList.add('group-navigation');
        const audiocallButton = document.createElement('button');
        audiocallButton.classList.add('group-navigation__game');
        audiocallButton.classList.add('group-navigation__game_audiocall');
        audiocallButton.innerText = 'Аудиовызов';
        groupNavigation.classList.add('games');
        audiocallButton.addEventListener('click', () => {
            const wordsForGame = this.eBookController.getWordsForGame(this.pagination.page);
            this.routerController.navigate('/audiocall', wordsForGame);
        });
        const sprintButton = document.createElement('button');
        sprintButton.classList.add('group-navigation__game');
        sprintButton.classList.add('group-navigation__game_sprint');
        sprintButton.innerText = 'Спринт';
        sprintButton.addEventListener('click', () => {
            const wordsForGame = this.eBookController.getWordsForGame(this.pagination.page);
            this.routerController.navigate('/sprint', wordsForGame);
        });
        if (this.eBookController.isPageLearned(this.pagination.page)) {
            sprintButton.disabled = true;
            audiocallButton.disabled = true;
        }
        groupNavigation.append(sprintButton);
        groupNavigation.append(pagination);
        groupNavigation.append(audiocallButton);

        this.rootElement.append(groups);
        this.rootElement.append(groupNavigation);
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-container');
        this.words.forEach((w) => {
            const templateCard = document.createElement('template');
            templateCard.innerHTML = template;
            const clone = templateCard.content.cloneNode(true) as HTMLDivElement;
            const wordCard = this.getWordCard(w, clone);
            bookContainer.append(wordCard);
        });
        this.rootElement.append(bookContainer);
    }
    destroy() {
        this.stopAudio();
        this.eBookController.abortController.abort();
    }
    async reDraw() {
        this.stopAudio();
        document.querySelector('.ebook-container')?.remove();
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-container');

        this.words = await this.eBookController.getPageFromGroup(this.pagination.page, this.group);
        this.words.forEach((w) => {
            const templateCard = document.createElement('template');
            templateCard.innerHTML = template;
            const clone = templateCard.content.cloneNode(true) as HTMLDivElement;
            const wordBlock = this.getWordCard(w, clone);
            bookContainer.append(wordBlock);
        });
        this.rootElement.append(bookContainer);
        if (this.eBookController.isPageLearned(this.pagination.page)) {
            document
                .querySelectorAll<HTMLButtonElement>('.group-navigation__game')
                .forEach((btn) => (btn.disabled = true));
            assertDefined(document.querySelector('.current-page')).classList.add('pages__page-num_learned');
        } else {
            document
                .querySelectorAll<HTMLButtonElement>('.group-navigation__game')
                .forEach((btn) => (btn.disabled = false));
        }
    }
    async getGroups(): Promise<HTMLUListElement> {
        const MAX_GROUP = 6;
        const ul = document.createElement('ul');
        ul.classList.add('group-list');
        for (let i = 0; i < MAX_GROUP; i++) {
            const li = this.getGroupLi(`<span class='group-name'>ГРУППА</span> ${i + 1}`, i);
            ul.append(li);
        }
        if (this.userController.isSignin()) {
            const li = this.getGroupLi(`<span class='group-name'>Сложные слова</span>`, HARD_WORD_GROUP_NUM);
            ul.append(li);
        }
        return ul;
    }
    private getGroupLi(groupName: string, groupNum: number): HTMLLIElement {
        const li = document.createElement('li');
        li.innerHTML = groupName;
        li.classList.add('group-list__group');
        if (this.group === groupNum) li.classList.add('group-list__group_active');
        li.dataset.group = groupNum.toString();
        li.addEventListener('click', async (ev: Event) => {
            this.stopAudio();
            assertDefined(document.querySelector('.group-list__group_active')).classList.remove(
                'group-list__group_active'
            );
            const target = ev.target as HTMLButtonElement;
            if (target.dataset.group === undefined) {
                const parentElement = assertDefined(target.parentElement);
                this.group = Number(parentElement.dataset.group);
                parentElement.classList.add('group-list__group_active');
            } else {
                target.classList.add('group-list__group_active');
                this.group = Number(target.dataset.group);
            }

            localStorage.setItem('group', `${this.group}`);
            await this.pagination.toFirstPage(this.group);
        });
        return li;
    }
    private getWordCard(word: wordType, template: HTMLDivElement): HTMLElement {
        const wordCard = template;
        const card = assertDefined(wordCard.querySelector('.word-card')) as HTMLDivElement;
        card.classList.add(`group${this.group}`);
        card.dataset.wordId = word.id;

        if (word.userWord !== undefined) {
            card.dataset.wordStatus = word.userWord.difficulty;
        }
        const audioBtn = assertDefined(wordCard.querySelector('#audioBtn')) as HTMLButtonElement;
        this.addAudioAction(word.audio, word.audioMeaning, word.audioExample, audioBtn);
        const img = assertDefined(wordCard.querySelector('#wordImg')) as HTMLImageElement;
        img.src = `${HOST}\\${word.image}`;
        img.alt = word.word;
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
        const easyMark = assertDefined(wordCard.querySelector('#easyMark')) as HTMLButtonElement;
        const learningMark = assertDefined(wordCard.querySelector('#learningMark')) as HTMLButtonElement;

        if (this.userController.isSignin()) {
            if (word.userWord !== undefined) {
                if (word.userWord.difficulty === wordStatus.easy) {
                    card.classList.add(`word-card_easy`);
                    easyMark.disabled = true;
                    markHard.disabled = true;
                } else if (word.userWord.difficulty === wordStatus.hard) {
                    card.classList.add(`word-card_hard`);
                    markHard.disabled = true;
                }
            }
            easyMark.addEventListener('click', (ev) => this.markCard(ev, wordStatus.easy));
            if (this.group === HARD_WORD_GROUP_NUM) {
                markHard.classList.add('hidden');
                learningMark.classList.remove('hidden');
                learningMark.addEventListener('click', (ev) => this.markCard(ev, wordStatus.learning));
            } else {
                markHard.addEventListener('click', (ev) => this.markCard(ev, wordStatus.hard));
            }
        } else {
            markHard.remove();
            easyMark.remove();
            learningMark.remove();
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
            if (
                target.classList.contains('word-action__audio_start') ||
                assertDefined(target.parentElement).classList.contains('word-action__audio_start')
            ) {
                this.stopAudio();
                currentAudio.play();
                this.togleAudioBtn(playBtn);
            } else {
                currentAudio.pause();
                this.togleAudioBtn(playBtn);
            }
        });
    }
    stopAudio() {
        document.querySelector<HTMLButtonElement>('.word-action__audio_stop')?.click();
    }
    private togleAudioBtn(target: HTMLButtonElement) {
        target.classList.toggle('word-action__audio_start');
        target.classList.toggle('word-action__audio_stop');
    }

    private async markCard(ev: Event, status: wordStatus) {
        const target = ev.target as HTMLButtonElement;
        const card = assertDefined(target.closest<HTMLElement>('.word-card'));
        const wordId = assertDefined(card.dataset.wordId);
        const date = new Date();

        const currentWord = assertDefined(this.words.find((word) => word.id === wordId));
        const currentWordProperty = currentWord.userWord;
        const wordUpdate: wordProperty = {
            difficulty: status,
            optional: {
                failed: currentWordProperty === undefined ? null : currentWordProperty.optional.failed,
                success: currentWordProperty === undefined ? null : currentWordProperty.optional.success,
                successRow: currentWordProperty === undefined ? null : currentWordProperty.optional.successRow,
                learnedDate:
                    status === wordStatus.easy ? `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}` : null,
                lastAttempt: currentWordProperty === undefined ? null : currentWordProperty.optional.lastAttempt,
            },
        };
        const group = this.group;
        await this.saveCardState(wordId, wordUpdate, card.dataset.wordStatus).then(() => {
            switch (status) {
                case wordStatus.hard:
                    card.classList.add(`word-card_hard`);
                    target.disabled = true;
                    card.dataset.wordStatus = wordStatus.hard;
                    break;
                case wordStatus.easy:
                    if (group === HARD_WORD_GROUP_NUM) {
                        card.remove();
                    } else {
                        card.classList.remove(`word-card_hard`);
                        card.classList.add(`word-card_easy`);
                        target.disabled = true;
                        assertDefined(card.querySelector<HTMLButtonElement>('#hardMark')).disabled = true;
                        card.dataset.wordStatus = status;
                    }
                    break;
                case wordStatus.learning: {
                    if (group === HARD_WORD_GROUP_NUM) {
                        card.remove();
                    }
                }
            }
        });
        const counHard = document.querySelectorAll(`.word-card_${wordStatus.hard}`).length;
        const counLearned = document.querySelectorAll(`.word-card_${wordStatus.easy}`).length;
        if (counHard + counLearned === WORDS_ON_PAGE) {
            assertDefined(document.querySelector('.current-page')).classList.add('pages__page-num_learned');
            document
                .querySelectorAll<HTMLButtonElement>('.group-navigation__game')
                .forEach((btn) => (btn.disabled = true));
        }
    }
    async saveCardState(wordId: string, wordUpdate: wordProperty, status: string | undefined) {
        if (status === undefined) {
            await this.wordController.addUserWord(wordId, wordUpdate);
        } else {
            await this.wordController.updateUserWord(wordId, wordUpdate);
        }
    }
}

export default EbookView;
