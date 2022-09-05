import {assertDefined, HOST, scanDate, typedEntries} from '../helpers/helpers';
import {responceUserWords, wordType} from '../helpers/types';

type DateStringBasedStats = {
    [date: string]: number
};

export type DateBasedStats = { date: Date, words: number }[];

type WordStats = {
    words: wordType[],
    cnt: number
};

//query example
// by lastAttempt: {"userWord.optional.lastAttempt":"2022-09-04"}
// by difficulty and lastAttempt {"$and":[{"userWord.difficulty":"learning", "userWord.optional.lastAttempt":"2022-09-03"}]}
// by dificulty {"$or":[{"userWord.difficulty":"learning", "userWord.difficulty":"hard"}]}
// for test Promise.resolve(StatisticsController.getInstance().getStats('{"$and":[{"userWord.difficulty":"learning", "userWord.optional.lastAttempt":"2022-09-03"}]}')).then(res => console.log(res));
export default class StatsController {
    private static instance: StatsController;
    abortController: AbortController | null = null;
    public static getInstance(): StatsController {
        if (!StatsController.instance) {
            StatsController.instance = new StatsController();
        }
        return StatsController.instance;
    }

    async getStats(queryString: string): Promise<WordStats> {
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
                const jsonResult = await response.json();
                return {
                    words: jsonResult[0].paginatedResults,
                    cnt: jsonResult[0].totalCount[0].count
                };
            } else {
                throw Error('Access token is missing or invalid.');
            }
        } catch {
            throw Error('Request was stopped.');
        } finally {
            this.abortController = null;
        }
    }

    async getLearnedWordsPerDate() {

    }

    async getNewWordsPerDate(): Promise<DateBasedStats> {
        const wordStats: WordStats = await this.getStats(`{"$and": [{"userWord.optional": {"$ne": null}},
            {"userWord.optional.firstAttempt": {"$ne": "null"}}]}`);
        const stats: DateStringBasedStats = {};
        console.log(wordStats);
        wordStats.words.reduce((st: DateStringBasedStats, word: wordType) => {
            const firstAttempt = assertDefined(word.userWord?.optional?.firstAttempt);
            if (st[firstAttempt] !== undefined)
                st[firstAttempt] += 1;
            else st[firstAttempt] = 1;
            return st;
        }, stats);
        return typedEntries(stats)
            .map(([date, cnt]) => ({date: scanDate(date as string), words: cnt}))
            .sort((a,b) => a.date.getTime() - b.date.getTime());
    }
}
