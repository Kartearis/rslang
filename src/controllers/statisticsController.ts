import { assertDefined, HOST } from '../helpers/helpers';
import { filtredWords, responceUserWords } from '../helpers/types';

//query example
// by lastAttempt: {"userWord.optional.lastAttempt":"2022-09-04"}
// by difficulty and lastAttempt {"$and":[{"userWord.difficulty":"learning", "userWord.optional.lastAttempt":"2022-09-03"}]}
// by dificulty {"$or":[{"userWord.difficulty":"learning", "userWord.difficulty":"hard"}]}
class StatisticsController {
    private static instance: StatisticsController;
    abortController: AbortController | null = null;
    public static getInstance(): StatisticsController {
        if (!StatisticsController.instance) {
            StatisticsController.instance = new StatisticsController();
        }
        return StatisticsController.instance;
    }

    private async getStats(queryString: string): Promise<filtredWords> {
        this.abortController = new AbortController();
        try {
            //3600 words in base
            const MAX_WORDS = 3600;
            const { userId, jwt } = localStorage;
            const url = `${HOST}/users/${userId}/aggregatedWords?${queryString}`;
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
                return responceUserWords[0];
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
