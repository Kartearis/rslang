import { assertDefined, COUNT_AUDIOCALL_RESPONSE_WORD } from '../helpers/helpers';
import { audiocallWord, wordGame, wordType } from '../helpers/types';
import AudiocallView from '../views/audiocallView';
import GameController from './gameController';
import DailyStatsController from './dailyStatsController';
import SprintOutroView from '../views/sprintGame/sprintOutroView';

class AudiocallController extends GameController {
    audiocallResults: wordGame[];
    rootElement: HTMLElement;
    itterator = 0;
    view: AudiocallView | null = null;
    constructor(rootElement: HTMLElement, _words: wordType[], view: AudiocallView | null = null) {
        super(_words);
        this.audiocallResults = [];
        this.dailyStatsController = new DailyStatsController('audio-game');
        this.rootElement = rootElement;
        this.view = view;
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
    rememberResult(_result: boolean) {
        const ERROR_FOR_EXIT = 5;
        this.audiocallResults.push({
            wordGame: this.words[this.itterator],
            result: _result,
        });
        if (this.audiocallResults.filter((answer) => !answer.result).length === ERROR_FOR_EXIT) this.endGame();
    }
    endGame() {
        document.removeEventListener('keydown', this.addKeyListener);
        this.saveResult(this.audiocallResults);
        this.itterator = 0;
        const countRightAnswer = this.audiocallResults.filter((answer) => answer.result).length;
        const resultView = new SprintOutroView(this.rootElement, this, countRightAnswer, this.audiocallResults);

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
        for (let i = arrId.length - 1; i > 0; i--) {
            const j = this.getRandomNum(i + 1);
            [arrId[i], arrId[j]] = [arrId[j], arrId[i]];
        }
        return arrId;
    }
    continue(): void {
        const audiocallView = assertDefined(this.view);
        audiocallView.show();
    }
}

export default AudiocallController;
