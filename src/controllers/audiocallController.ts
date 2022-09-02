import { assertDefined, COUNT_AUDIOCALL_RESPONSE_WORD, COUNT_AUDIOCALL_WORDS } from '../helpers/helpers';
import { audiocallWord, wordGame, wordType } from '../helpers/types';
import AudiocallView from '../views/audiocallView';
import GameController from './gameController';
import SprintOutroView from '../views/sprintGame/sprintOutroView';

class AudiocallController extends GameController {
    audiocallResults: wordGame[];
    rootElement: HTMLElement;
    itterator:number = 0;
    constructor(rootElement: HTMLElement, _words: wordType[]) {
        super(_words);
        this.audiocallResults = [];
        this.rootElement = rootElement;
        document.addEventListener('keydown', this.addKeyListener);
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
    endGame(){
        document.removeEventListener('keydown', this.addKeyListener);
        this.saveResult(this.audiocallResults);
        const countRightAnswer = this.audiocallResults.filter(answer => answer.result).length;
        debugger
        const resultView = new SprintOutroView(this.rootElement, this, countRightAnswer, this.audiocallResults);
        resultView.show();
    }
    addKeyListener(ev: KeyboardEventInit) {
        const key = assertDefined(ev.key);
        if (key === 'Enter') {
            const donkKnowBtn = assertDefined(document.querySelector<HTMLButtonElement>('#donkKnowBtn'));
            const nextWordBtn = assertDefined(document.querySelector<HTMLButtonElement>('#nextBtn'));
            donkKnowBtn.classList.contains('hidden') ? nextWordBtn.click() : donkKnowBtn.click();
        }
        if (['1', '2', '3', '4', '5'].includes(key)) {
            const keyNum = Number(key) - 1;
            document.querySelectorAll<HTMLButtonElement>('.option')[keyNum].click();
        }
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

        const audiocallView = new AudiocallView(this.rootElement);
        audiocallView.show();
    }
}

export default AudiocallController;
