import { GROUP_NAME, HOST } from '../helpers/helpers';
import { responceUserWords, wordStatus, wordType } from '../helpers/types';
import UserController from './userController';
const COUNT_PAGES = 30;
class EBookController {
    private static instance: EBookController;
    private allGroupWords: wordType[][] = [];
    private userController: UserController;
    private constructor(){
        this.userController = UserController.getInstance();
    }
    public static getInstance(): EBookController {

        if (!EBookController.instance) {
            EBookController.instance = new EBookController();
        }
        return EBookController.instance;
    }
    async getPageWordsOnGroup(): Promise<void> {
        const group = sessionStorage.getItem(GROUP_NAME) === undefined ? 0 : localStorage.getItem(GROUP_NAME);
        let arrResponse: Promise<Response>[] = [];
        for(let i = 0; i < COUNT_PAGES; i += 1){
            const response = fetch(`${HOST}/words?group=${group}&page=${i}`, {
                method: 'GET',
            });
            arrResponse.push(response);
        }
        Promise.all(arrResponse).then(  (respArr) => {
            respArr.forEach(async (resp) => {
                if (resp.ok) {
                    this.allGroupWords.push((await resp.json()) as wordType[]) ;
                } else {
                    throw Error('Error get unauthorized user words');
                }
            })
        })
    }
    async getGroupUserWords(): Promise<void> {
        const group = sessionStorage.getItem(GROUP_NAME) === undefined ? 0 : localStorage.getItem(GROUP_NAME);
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
            for(let i = 0; i < COUNT_PAGES; i += 1){
                const pageWords = responceUserWords[0].paginatedResults.filter(word => word.page === i);
                if(pageWords !== undefined) this.allGroupWords.push(pageWords);
            }
        } else {
            throw Error('Access token is missing or invalid');
        }
    }
    async loadGroupUserWords(): Promise<void> {
        this.userController.isSignin() ? this.getGroupUserWords() : this.getPageWordsOnGroup();
    }
    isPageLearned(page: number): boolean {
        return this.allGroupWords[page].some(word => {
            if(word.userWord !== undefined){
                return (word.userWord.difficulty !== wordStatus.easy) && (word.userWord.difficulty !== wordStatus.hard);
            }
            return true;
        })
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
