import { GROUP_NAME, HOST } from '../helpers/helpers';
import { responceUserWords, wordStatus, wordType } from '../helpers/types';
import UserController from './userController';
const COUNT_PAGES = 30;
type groupWords = {
    group: number,
    words: wordType[][]
}
class EBookController {
    private static instance: EBookController;
    private groupWords: groupWords = { group: 0, words: [] }
    userController: UserController;
    private constructor() {
        this.userController = UserController.getInstance();
    }
    public static getInstance(): EBookController {
        if (!EBookController.instance) {
            EBookController.instance = new EBookController();
        }
        return EBookController.instance;
    }
    async getGroupWords(_group: number | null = null) {
        const group = _group === null ? this.groupWords.group : _group;
        if (group !== this.groupWords.group) {
            console.log(this.userController.isSignin());
            if (this.userController.isSignin()) {
                await this.loadAuthGroup(group).then(() => console.log(this.groupWords))
            } else {
                await this.loadUnauthGroup(group).then(() => console.log(this.groupWords))
            }
            this.groupWords.group = group;
        }
        return this.groupWords.words;
    }

    async getPageWords(_page: number | null = null): Promise<wordType[]> {
        const page = _page === null ? 1 : _page;
        if (this.groupWords.words.length === 0) await this.getGroupWords();
        return this.groupWords.words[page];
    }

    isPageLearned(page: number): boolean {
        console.log(this.groupWords);
        return this.groupWords.words[page].some(word => {
            if (word.userWord !== undefined) {
                return (word.userWord.difficulty !== wordStatus.easy) && (word.userWord.difficulty !== wordStatus.hard);
            }
            return true;
        })
    }
    async loadUnauthGroup(group: number): Promise<void> {
        let arrResponse: Promise<Response>[] = [];
        for (let i = 0; i < COUNT_PAGES; i += 1) {
            const response = fetch(`${HOST}/words?group=${group}&page=${i}`, {
                method: 'GET',
            });
            arrResponse.push(response);
        }
        Promise.all(arrResponse).then((respArr) => {
            respArr.forEach(async (resp) => {
                if (resp.ok) {
                    this.groupWords.words.push((await resp.json()) as wordType[]);
                } else {
                    throw Error('Error get unauthorized user words');
                }
            })
        })
    }
    async loadAuthGroup(group: number): Promise<void> {
        const { userId, jwt } = localStorage;
        const url = `${HOST}/users/${userId}/aggregatedWords?group=${group}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
        });
        if (response.ok) {
            const responceUserWords = (await response.json()) as responceUserWords;
            for (let i = 0; i < COUNT_PAGES; i += 1) {
                const pageWords = responceUserWords[0].paginatedResults.filter(word => word.page === i);
                if (pageWords !== undefined) this.groupWords.words.push(pageWords);
            }
        } else {
            throw Error('Access token is missing or invalid');
        }
    }
    async getHardWordsUser(): Promise<wordType[]> {
        const { userId, jwt } = localStorage;
        const max_words = 999;
        const response = await fetch(
            `${HOST}/users/${userId}/aggregatedWords?wordsPerPage=${max_words}&filter={"userWord.difficulty":"hard"}`,
            {
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
            return arrWords;
        } else {
            throw Error('Access token is missing or invalid');
        }
    }
}

export default EBookController;
