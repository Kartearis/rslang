import Pagination from "./pagination";
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
const HOST = 'https://rs-lang-proj.herokuapp.com';
class EbookView{
    container: HTMLElement;
    group: number = 0;
    pagination: Pagination;

    constructor(_container: HTMLElement){
        this.container = _container;
        this.pagination = new Pagination();
        this.pagination.limitPage = 30;
    }

    async drawEbook(){
        const groups = this.getGroups();
        const pagination = this.pagination.getPagination(() => this.reDraw());
        this.container.append(groups);
        this.container.append(pagination);
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-continer');
        const words = await this.testWords();
        if(words !== null){
            words.forEach( w => {
                const wordBlock = this.getWordBlock(w);
                bookContainer.append(wordBlock);
            })
        }
        this.container.append(bookContainer);
    }

    async reDraw(){
        document.querySelector('.ebook-continer')?.remove();
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('ebook-continer');
        const words = await this.testWords();
        if(words !== null){
            words.forEach( w => {
                const wordBlock = this.getWordBlock(w);
                bookContainer.append(wordBlock);
            })
        }
        this.container.append(bookContainer);
    }
    // Заглушка для вёрски
    async testWords(): Promise<wordType[] | null>{
        const response = await fetch( `${HOST}/words?group=${this.group}&page=${this.pagination.page}`, {
            method: 'GET'
        });
        if(response.status === 200){
            return await response.json() as wordType[];
        }
        return null;
    }

    getGroups(): HTMLUListElement{
        const MAX_GROUP = 6;
        const ul = document.createElement('ul');
        for (let i = 0; i < MAX_GROUP; i++) {
            const li = document.createElement('li');
            li.textContent = `GROUP ${i+1}`;
            ul.append(li);
        }
        return ul;
    }

    getWordBlock(word: wordType): HTMLElement{
        const wordBlock = document.createElement('div');
        wordBlock.classList.add('word-container');
        wordBlock.dataset.wordId = word.id;
        const wordImg = document.createElement('img');
        wordImg.src = `${HOST}\\${word.image}`;
        wordBlock.append(wordImg);
        const wordRow = this.getWordInfo(word.word, word.wordTranslate, word.audio, word.transcription);
        wordBlock.append(wordRow);
        const wordMeaning = this.getWordInfo(word.textMeaning, word.textMeaningTranslate, word.audioMeaning);
        wordBlock.append(wordMeaning);
        const wordExample = this.getWordInfo(word.textExample, word.textExampleTranslate, word.audioExample);
        wordBlock.append(wordExample);
        return wordBlock;
    }
    getWordInfo(word: string, translate: string, audio: string, transcription: string | null = null){
        const row = document.createElement('div');
        const wordVal = document.createElement('p');
        wordVal.insertAdjacentHTML('afterbegin', word) ;
        row.append(wordVal);
        if(transcription !== null) {
            const wordTranscription = document.createElement('p');
            wordTranscription.innerText = transcription;
            row.append(wordTranscription);
        }
        const wordTranslate = document.createElement('p');
        wordTranslate.innerText = translate;
        row.append(wordTranslate);
        const wordAudio = document.createElement('audio');
        wordAudio.controls = true;
        const wordAudioSource = document.createElement('source');
        wordAudioSource.src = `${HOST}\\${audio}`;
        wordAudioSource.type = "audio/mpeg";
        wordAudio.append(wordAudioSource);
        row.append(wordAudio);
        return row;
    }
}


export default EbookView