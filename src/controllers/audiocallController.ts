import { assertDefined, COUNT_AUDIOCALL_RESPONSE_WORD, COUNT_AUDIOCALL_WORDS } from '../helpers/helpers';
import { audiocallWord, wordGame, wordType } from '../helpers/types';
import AudiocallView from '../views/audiocallView';
import GameController from './gameController';
import SprintOutroView from '../views/sprintGame/sprintOutroView';

class AudiocallController extends GameController {
    audiocallResults: wordGame[];
    rootElement: HTMLElement;
    itterator: number = 0;
    view: AudiocallView | null = null;
    constructor(rootElement: HTMLElement, _words: wordType[]) {
        super(_words);
        this.audiocallResults = [];
        this.rootElement = rootElement;

    }

    getNextWord(): audiocallWord[] {
        this.itterator += 1;
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
    }
    endGame(view: AudiocallView) {
        this.saveResult(this.audiocallResults);
        const countRightAnswer = this.audiocallResults.filter(answer => answer.result).length;
        const resultView = new SprintOutroView(this.rootElement, this, countRightAnswer, this.audiocallResults);
        this.view = view;
        resultView.show();
    }

    exit(): void {
        this.routerController.back();
    }
    //get shufled word array of number
    private getResponseWordId(curentWordId: number): number[] {
        const arrId = [curentWordId];
        let testId = -1;
        while (arrId.length !== COUNT_AUDIOCALL_RESPONSE_WORD) {
            testId = this.getRandomNum(this.words.length);
            if (!arrId.includes(testId)) {
                arrId.push(testId);
            }
        }
        const shufledArr = this.shuffleArray(arrId);
        return shufledArr;
    }
    continue(): void {
        const audiocallView = assertDefined(this.view);
        audiocallView.show();
    }
}

export default AudiocallController;
