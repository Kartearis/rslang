import { COUNT_GAME_RESPONSE_WORD } from '../helpers/helpers';
import { audiocallWord, wordGame, wordType } from '../helpers/types';
import GameController from './gameController';

class AudiocallController extends GameController {
    audiocallResults: wordGame[];
    constructor(_words: wordType[]) {
        super(_words);
        this.audiocallResults = [];
    }

    itterator = 0;
    getNextWord(): audiocallWord[] {
        this.itterator += 1;
        this.words;
        return this.getResponseWords();
    }
    getResponseWords(): audiocallWord[] {
        const responseOptionsIndex = this.getResponseWordId(this.itterator);
        const responseOptionsWords = responseOptionsIndex.map<audiocallWord>((index) => {
            const wordGameResult = {
                wordGame: this.words[index],
                right: index === this.itterator ? true : false,
                result: false,
            };
            return wordGameResult;
        });
        return responseOptionsWords;
    }
    async rememberResult(_result: boolean) {
        this.audiocallResults.push({
            wordGame: this.words[this.itterator],
            result: _result,
        });
        if (this.itterator === this.words.length - 1) {
            await this.saveResult(this.audiocallResults);
        }
    }
    //get shufled word array of number
    private getResponseWordId(curentWordId: number): number[] {
        const arrId = [curentWordId];
        let testId = -1;
        while (arrId.length !== COUNT_GAME_RESPONSE_WORD) {
            testId = this.getRandomNum(this.words.length);
            if (!arrId.includes(testId)) {
                arrId.push(testId);
            }
        }
        const shufledArr = this.shufleArray(arrId);
        return shufledArr;
    }
}

export default AudiocallController;
