import { HOST } from '../helpers/helpers';
import { filterForUserWords, responceUserWords, wordType } from '../helpers/types';

class EBookController {
    private static instance: EBookController;

    public static getInstance(): EBookController {
        if (!EBookController.instance) {
            EBookController.instance = new EBookController();
        }
        return EBookController.instance;
    }
    async getPageWordsOnGroup(group: number, page: number): Promise<wordType[]> {
        const response = await fetch(`${HOST}/words?group=${group}&page=${page}`, {
            method: 'GET',
        });
        if (response.ok) {
            return (await response.json()) as wordType[];
        } else {
            throw Error('Access token is missing or invalid');
        }
    }
    async getGroupUserWords(group: number): Promise<wordType[]> {
        const MAX_GROUP_WORDS = 560;
        const { userId, jwt } = localStorage;
        const url = `${HOST}/users/${userId}/aggregatedWords?group=${group}&wordsPerPage=${MAX_GROUP_WORDS}&${filterForUserWords.learned}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
        });
        if (response.ok) {
            const responceUserWords = (await response.json()) as responceUserWords;
            return responceUserWords[0].paginatedResults;
        } else {
            throw Error('Access token is missing or invalid');
        }
    }
    async getWordsUserOnPage(group: number, page: number): Promise<wordType[]> {
        const words = await this.getPageWordsOnGroup(group, page);
        const userWordsOnGroup = await this.getGroupUserWords(group);
        words.forEach((word) => {
            const userWord = userWordsOnGroup.find((userWord) => userWord.word === word.word);
            if (userWord !== undefined) {
                word.userWord = userWord.userWord;
            }
        });
        return words;
    }
    // async getWordsUserOnPage(group: number, page: number): Promise<wordType[]> {
    //     const { userId, jwt } = localStorage;
    //     const url = `${HOST}/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${WORDS_ON_PAGE}`;
    //     const response = await fetch(url, {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${jwt}`,
    //         },
    //     });
    //     if (response.status === 200) {
    //         const arr = await response.json();
    //         const arrWords: wordType[] = arr[0].paginatedResults;
    //         return arrWords;
    //     } else {
    //         throw Error('Access token is missing or invalid');
    //     }
    // }
    async getHardWordsUser(): Promise<wordType[]> {
        const { userId, jwt } = localStorage;
        const max_words = 999;
        const response = await fetch(
            `${HOST}/users/${userId}/aggregatedWords?wordsPerPage=${max_words}&filter=${filterForUserWords.hard}`,
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
    // async getCountLearnedWordsOnPage(group: number, page: number): Promise<number | null> {
    //     const { userId, jwt } = localStorage;
    //     const url =
    //         `${HOST}/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${WORDS_ON_PAGE}&filter=${filterForUserWords.learned}`;
    //     const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 Authorization: `Bearer ${jwt}`,
    //             },
    //         }
    //     );
    //     if (response.status === 200) {
    //         const arr = await response.json() as responceUserWords;
    //         console.log(arr[0].totalCount[0].count);
    //         const count = arr[0].totalCount[0].count;
    //         return Number(count);
    //     }
    //     return null;
    // }
}

export default EBookController;
