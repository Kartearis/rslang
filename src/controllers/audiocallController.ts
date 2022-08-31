import { assertDefined, COUNT_AUDIOGAME_RESPONSE_WORD } from '../helpers/helpers';
import { audiocallWord, wordGame, wordType } from '../helpers/types';
import GameController from './gameController';

class AudiocallController extends GameController {
    audiocallResults: wordGame[];
    private rootElement: HTMLElement;
    constructor(rootElement: HTMLElement, _words: wordType[]) {
        super(_words);
        this.audiocallResults = [];
        this.rootElement = rootElement;
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
    rememberResult(_result: boolean) {
        this.audiocallResults.push({
            wordGame: this.words[this.itterator],
            result: _result,
        });
        if (this.itterator === this.words.length - 1) {
            document.removeEventListener('keydown', this.addKeyListener);
            this.saveResult(this.audiocallResults);
        }
    }
    addKeyListener(ev: KeyboardEventInit) {
        const key = assertDefined(ev.key);
        if (key === 'Enter') {
            assertDefined(document.querySelector<HTMLButtonElement>('.answerBtn')).click();
        }
        if (['1', '2', '3', '4', '5'].includes(key)) {
            const keyNum = Number(key) - 1;
            document.querySelectorAll<HTMLButtonElement>('.option')[keyNum].click();
        }
    }
    //get shufled word array of number
    private getResponseWordId(curentWordId: number): number[] {
        const arrId = [curentWordId];
        let testId = -1;
        while (arrId.length !== COUNT_AUDIOGAME_RESPONSE_WORD) {
            testId = this.getRandomNum(this.words.length);
            if (!arrId.includes(testId)) {
                arrId.push(testId);
            }
        }
        const shufledArr = this.shuffleArray(arrId);
        return shufledArr;
    }
}

export default AudiocallController;
