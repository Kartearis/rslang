import { HOST } from '../helpers/helpers';
import { wordType } from '../helpers/types';

class EBookController {
    async getGroupWords(group: number, page: number): Promise<wordType[] | null> {
        const response = await fetch(`${HOST}/words?group=${group}&page=${page}`, {
            method: 'GET',
        });
        if (response.status === 200) {
            return (await response.json()) as wordType[];
        }
        return null;
    }
    async getGroupWordsUser(group: number, page: number): Promise<wordType[] | null> {
        const { userId, jwt } = localStorage;
        const response = await fetch(`${HOST}/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=20`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,

            },
        });
        if (response.status === 200) {
            let arr = await response.json();
            let arrWords: wordType[] = arr[0].paginatedResults;
            return arrWords;
        }
        return null;
    }
    async getHardWordsUser(): Promise<wordType[] | null> {
        const { userId, jwt } = localStorage;
        const response = await fetch(`${HOST}/users/${userId}/aggregatedWords?filter={"userWord.difficulty":"hard"}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        });
        if (response.status === 200) {
            let arr = await response.json();
            let arrWords: wordType[] = arr[0].paginatedResults;
            return arrWords;
        }
        return null;
    }
}

export default EBookController;
