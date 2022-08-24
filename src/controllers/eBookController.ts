import { HOST, WORDS_ON_PAGE } from '../helpers/helpers';
import { filterForUserWords, responceUserWords, wordType } from '../helpers/types';

class EBookController {
    private static instance: EBookController;

    public static getInstance(): EBookController {
        if (!EBookController.instance) {
            EBookController.instance = new EBookController();
        }
        return EBookController.instance;
    }
    private constructor(){}
    async getGroupWords(group: number, page: number): Promise<wordType[] | null> {
        const response = await fetch(`${HOST}/words?group=${group}&page=${page}`, {
            method: 'GET',
        });
        if (response.status === 200) {
            return (await response.json()) as wordType[];
        }
        return null;
    }
    async getWordsUserOnPage(group: number, page: number): Promise<wordType[] | null> {
        const { userId, jwt } = localStorage;
        const url = `${HOST}/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${WORDS_ON_PAGE}`;
        const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        if (response.status === 200) {
            const arr = await response.json();
            const arrWords: wordType[] = arr[0].paginatedResults;
            return arrWords;
        }
        return null;
    }
    async getHardWordsUser(): Promise<wordType[] | null> {
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
            const arr = await response.json() as responceUserWords;
            const arrWords: wordType[] = arr[0].paginatedResults;
            return arrWords;
        }
        return null;
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
