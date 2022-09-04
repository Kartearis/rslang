import { assertDefined, HOST } from '../helpers/helpers';
import { responceUserWords } from '../helpers/types';

//query example
// by lastAttempt: {"userWord.optional.lastAttempt":"2022-09-04"}
// by difficulty and lastAttempt {"$and":[{"userWord.difficulty":"learning", "userWord.optional.lastAttempt":"2022-09-03"}]}
// by dificulty {"$or":[{"userWord.difficulty":"learning", "userWord.difficulty":"hard"}]}
// for test Promise.resolve(StatisticsController.getInstance().getStats('{"$and":[{"userWord.difficulty":"learning", "userWord.optional.lastAttempt":"2022-09-03"}]}')).then(res => console.log(res));
class StatisticsController {
    private static instance: StatisticsController;
    abortController: AbortController | null = null;
    public static getInstance(): StatisticsController {
        if (!StatisticsController.instance) {
            StatisticsController.instance = new StatisticsController();
        }
        return StatisticsController.instance;
    }

    async getStats(queryString: string): Promise<number> {
        this.abortController = new AbortController();
        try {
            //3600 words in base
            const MAX_WORDS = 3600;
            const { userId, jwt } = localStorage;
            const url = `${HOST}/users/${userId}/aggregatedWords?wordsPerPage=${MAX_WORDS}&&filter=${queryString}`;
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
                const count = responceUserWords[0].totalCount[0].count;
                return Number(count);
            } else {
                throw Error('Access token is missing or invalid.');
            }
        } catch {
            throw Error('Request was stopped.');
        } finally {
            this.abortController = null;
        }
    }
}

export default StatisticsController;
