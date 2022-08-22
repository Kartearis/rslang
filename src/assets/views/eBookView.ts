import Pagination from "./pagination";
import './eBook.css'
type wordType = {
    "id": "string",
    "group": 0,
    "page": 0,
    "word": "string",
    "image": "string",
    "audio": "string",
    "audioMeaning": "string",
    "audioExample": "string",
    "textMeaning": "string",
    "textExample": "string",
    "transcription": "string",
    "wordTranslate": "string",
    "textMeaningTranslate": "string",
    "textExampleTranslate": "string"
};
enum sentenceEnum {
    example,
    meaning
}
const HOST = 'https://rs-lang-proj.herokuapp.com';
class EbookView {
    container: HTMLElement;
    group: number = 0;
    pagination: Pagination;

    constructor(_container: HTMLElement) {
        this.container = _container;
        this.pagination = new Pagination();
        this.pagination.limitPage = 30;
    }

    async drawEbook() {
        const groups = this.getGroups();
        const pagination = this.pagination.getPagination(() => this.reDraw());
        this.container.append(groups);
        this.container.append(pagination);
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-continer');
        const words = await this.testWords();
        if (words !== null) {
            words.forEach(w => {
                const wordBlock = this.getWordBlock(w);
                bookContainer.append(wordBlock);
            })
        }
        this.container.append(bookContainer);
    }

    async reDraw() {
        document.querySelector('.ebook-continer')?.remove();
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-continer');
        const words = await this.testWords();
        if (words !== null) {
            words.forEach(w => {
                const wordBlock = this.getWordBlock(w);
                bookContainer.append(wordBlock);
            })
        }
        this.container.append(bookContainer);
    }
    // Заглушка для вёрски
    async testWords(): Promise<wordType[] | null> {
        const response = await fetch(`${HOST}/words?group=${this.group}&page=${this.pagination.page}`, {
            method: 'GET'
        });
        if (response.status === 200) {
            return await response.json() as wordType[];
        }
        return null;
    }

    getGroups(): HTMLUListElement {
        const MAX_GROUP = 6;
        const ul = document.createElement('ul');
        for (let i = 0; i < MAX_GROUP; i++) {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.dataset.group = `${i}`;
            btn.addEventListener('click', (ev: Event) => {
                const target = ev.target as HTMLButtonElement;
                this.group = Number(target.dataset.group);
                this.reDraw();
            });
            btn.innerText = `GROUP ${i + 1}`;
            li.append(btn);
            ul.append(li);
        }
        return ul;
    }

    getWordBlock(word: wordType): HTMLElement {
        const wordBlock = document.createElement('div');
        wordBlock.classList.add('word-container');
        wordBlock.dataset.wordId = word.id;
        const wordImg = document.createElement('img');
        wordImg.src = `${HOST}\\${word.image}`;
        wordBlock.append(wordImg);
        const wordRow = this.getWordInfo(word.id, word.word, word.wordTranslate, word.audio, word.transcription);
        wordBlock.append(wordRow);
        const wordMeaning = this.getWordSentence(word.id, word.textMeaning, word.textMeaningTranslate, word.audioMeaning);
        wordBlock.append(wordMeaning);
        const wordExample = this.getWordSentence(word.id, word.textExample, word.textExampleTranslate, word.audioExample, sentenceEnum.example);
        wordBlock.append(wordExample);
        return wordBlock;
    }
    getWordInfo(id: string, word: string, translate: string, audio: string, transcription: string | null = null) {
        const row = document.createElement('div');
        this.addAudio(row, id, audio);
        const wordVal = document.createElement('p');
        wordVal.insertAdjacentHTML('afterbegin', `${word} ${transcription} - ${translate} `);
        row.append(wordVal);
        return row;
    }
    private addAudio(row: HTMLElement, id: string, audio: string) {
        const wordId = `word_${id}`;
        const playBtn = document.createElement('button');
        playBtn.classList.add('start');
        playBtn.addEventListener('click', (ev: Event) => {
            const target = ev.target as HTMLButtonElement;
            if (target.classList.contains('start')) {
                document.querySelector<HTMLAudioElement>(`#${wordId}`)?.play();
            } else {
                document.querySelector<HTMLAudioElement>(`#${wordId}`)?.pause();
            }
        });

        row.append(playBtn);
        const wordAudio = document.createElement('audio');
        wordAudio.id = wordId;
        wordAudio.src = `${HOST}\\${audio}`;
        wordAudio.addEventListener('play', () => this.togleAudioBtn(playBtn));
        wordAudio.addEventListener('pause', () => this.togleAudioBtn(playBtn));
        row.append(wordAudio);
    }
    private togleAudioBtn(target: HTMLButtonElement) {
        target.classList.toggle('start');
        target.classList.toggle('stop');
    }
    getWordSentence(id: string, sentence: string, translate: string, audio: string, type: sentenceEnum = sentenceEnum.meaning) {
        const row = document.createElement('div');
        const sentId = `sent${type}_${id}`
        this.addAudio(row, sentId, audio);
        const wordVal = document.createElement('p');
        wordVal.insertAdjacentHTML('afterbegin', sentence);
        row.append(wordVal);
        const wordTranslate = document.createElement('p');
        wordTranslate.innerText = translate;
        row.append(wordTranslate);
        return row;
    }
}


export default EbookView