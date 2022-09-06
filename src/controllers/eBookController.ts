import { assertDefined, HARD_WORD_GROUP_NUM, HOST } from '../helpers/helpers';
import { responceUserWords, wordProperty, wordStatus, wordType } from '../helpers/types';
import UserController from './userController';
const COUNT_PAGES = 30;
type groupWords = {
    group: number;
    words: wordType[][];
};
class EBookController {
    private static instance: EBookController;
    private groupWords: groupWords = { group: -1, words: [] };
    userController: UserController;
    abortController: AbortController | null = null;
    private constructor() {
        this.userController = UserController.getInstance();
        // this.abortController = new AbortController();
    }
    public static getInstance(): EBookController {
        if (!EBookController.instance) {
            EBookController.instance = new EBookController();
        }
        return EBookController.instance;
    }

    getWordsForGame(page: number): wordType[][] {
        const gameWords = [];
        for (let i = page; i >= 0; i -= 1) {
            const unlearnedWords = this.groupWords.words[i].filter((word) => {
                return word.userWord === undefined || word.userWord.difficulty !== wordStatus.easy;
            });
            gameWords.push(unlearnedWords);
        }
        return gameWords;
    }
    private async loadGroup(group: number) {
        this.groupWords.words = [];
        if (this.userController.isSignin()) {
            if (group === HARD_WORD_GROUP_NUM) {
                this.groupWords.words[0] = await this.getHardWordsUser();
            } else {
                await this.loadAuthGroup(group);
            }
        } else {
            await this.loadUnauthGroup(group);
        }
    }
    async getGroupWords(group: number) {
        if (group !== this.groupWords.group) {
            await this.loadGroup(group);
        }
        return this.groupWords.words;
    }

    async getPageFromGroup(page: number, group: number): Promise<wordType[]> {
        if (group !== this.groupWords.group || this.groupWords.words.length === 0) {
            this.groupWords.group = group;
            await this.loadGroup(group);
        }

        return this.groupWords.words[page];
    }

    isPageLearned(page: number): boolean {
        if (this.groupWords.group === HARD_WORD_GROUP_NUM) return false;
        return !this.groupWords.words[page].some((word) => {
            if (word.userWord !== undefined) {
                return word.userWord.difficulty !== wordStatus.easy && word.userWord.difficulty !== wordStatus.hard;
            }
            return true;
        });
    }
    private async loadUnauthGroup(group: number): Promise<void> {
        this.abortController = new AbortController();
        try {
            for (let i = 0; i < COUNT_PAGES; i += 1) {
                const response = await fetch(`${HOST}/words?group=${group}&page=${i}`, {
                    signal: assertDefined(this.abortController).signal,
                    method: 'GET',
                });
                if (response.ok) {
                    const words: wordType[] = await response.json();
                    this.groupWords.words.push(words);
                } else {
                    throw Error('Error get unauthorized user words');
                }
            }
        } finally {
            this.abortController = null;
        }
    }
    private async loadAuthGroup(group: number): Promise<void> {
        this.abortController = new AbortController();
        try {
            const WORDS_IN_GROUP = 600;
            const { userId, jwt } = localStorage;
            const url = `${HOST}/users/${userId}/aggregatedWords?group=${group}&wordsPerPage=${WORDS_IN_GROUP}`;
            const response = await fetch(url, {
                signal: assertDefined(this.abortController).signal,
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });
            if (response.ok) {
                const responceUserWords = (await response.json()) as responceUserWords;
                for (let i = 0; i < COUNT_PAGES; i += 1) {
                    const pageWords = responceUserWords[0].paginatedResults.filter((word) => word.page === i);
                    if (pageWords !== undefined) {
                        //word has Id field, but userWord save id word as _id. Rewrite.
                        pageWords.forEach((word) => {
                            if (word._id !== undefined) word.id = word._id;
                        });
                        this.groupWords.words.push(pageWords);
                    }
                }
            } else {
                throw Error('Access token is missing or invalid.');
            }
        } catch {
            throw Error('Request was stopped.');
        } finally {
            this.abortController = null;
        }
    }
    private async getHardWordsUser(): Promise<wordType[]> {
        this.abortController = new AbortController();
        try {
            const { userId, jwt } = localStorage;
            //3600 words in base
            const MAX_WORDS = 3600;
            const response = await fetch(
                `${HOST}/users/${userId}/aggregatedWords?wordsPerPage=${MAX_WORDS}&filter={"userWord.difficulty":"hard"}`,
                {
                    signal: assertDefined(this.abortController).signal,
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            if (response.status === 200) {
                const arr = (await response.json()) as responceUserWords;
                const arrWords: wordType[] = arr[0].paginatedResults;
                arrWords.forEach((word) => {
                    if (word._id !== undefined) word.id = word._id;
                });
                arrWords.sort(
                    (a, b) =>
                        Number(b.group < a.group) - Number(a.group < b.group) ||
                        Number(b.page < a.page) - Number(a.page < b.page)
                );
                return arrWords;
            } else {
                throw Error('Access token is missing or invalid');
            }
        } finally {
            this.abortController = null;
        }
    }
    updateWord(wordId: string, property: wordProperty) {
        let flgSuccess = false;
        for (let i = 0; i < this.groupWords.words.length; i++) {
            const page = this.groupWords.words[i];
            for (let j = 0; j < page.length; j++) {
                const word = page[j];
                if (word.id === wordId) {
                    word.userWord = property;
                    flgSuccess = true;
                    break;
                }
                if (flgSuccess) break;
            }
        }
    }
}

export default EBookController;
