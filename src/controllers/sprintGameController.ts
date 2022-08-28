import ComboCounter from "../components/comboCounter";
import Timer from "../components/timer";
import ViewInterface from "../views/viewInterface";
import SprintIntroView from "../views/sprintGame/sprintIntroView";
import SprintMainView from "../views/sprintGame/sprintMainView";
import SprintOutroView from "../views/sprintGame/sprintOutroView";
import RouterController from "./routerController";
import {wordType} from "../helpers/types";
import {assertDefined} from "../helpers/helpers";

const ChanceOfCorrect = 0.6;

export type WordState = {
    word: wordType,
    result: boolean
}

export type SprintWord = {
    word: string,
    translation: string
}

export default class SprintGameController {
    private words: wordType[] = []
    private history: WordState[] = []
    private translations: string[] = []
    private comboCounter: ComboCounter
    private timer: Timer
    private view: ViewInterface | null = null
    private rootElement: HTMLElement
    private router: RouterController

    private points: number = 0
    private index: number = 0

    constructor(rootElement: HTMLElement, words: wordType[]) {
        this.rootElement = rootElement;
        this.words = words;
        this.translations = this.words.map((word) => word.wordTranslate);
        this.timer = new Timer(60);
        this.comboCounter = new ComboCounter();
        this.router = RouterController.getInstance();
    }

    showIntro(): void {
        this.view = new SprintIntroView(this.rootElement, this);
        this.view.show();
    }

    startGame(): void {
        this.view = new SprintMainView(this.rootElement, this.timer, this.comboCounter, this);
        this.index = 0;
        this.points = 0;
        this.timer.addEventListener('timeUp', () => this.showResults());
        this.view.show();
        this.showWord();
    }

    showResults(): void {
        // Should actually defined on all views (via base view) and called without typeguard
        // TODO: refactor
        if (this.view instanceof SprintMainView)
            this.view.removeGlobalHandlers();
        this.view = new SprintOutroView(this.rootElement, this, this.points, this.history);
        this.view.show();
    }

    exit(): void {
        // TODO: refactor
        if (this.view instanceof SprintMainView)
            this.view.removeGlobalHandlers();
        this.router.back();
    }

    awardPoints(): void {
        const points = 20 * (this.comboCounter.combo + 1);
        this.points += points;
        if (this.view instanceof SprintMainView)
            this.view.updatePoints(this.points);
    }

    // TODO: String literals may be remade to enum
    handleUserAnswer(answer: "wrong" | "right", word: string, translation: string): void {
        const originalWord: wordType = assertDefined(this.words.find((w) => w.word === word));
        const correctAnswer = translation === originalWord.wordTranslate ? 'right' : 'wrong';
        if (correctAnswer === answer) {
            this.history.push({
                word: originalWord,
                result: true
            });
            this.awardPoints();
            this.comboCounter.up();
        }
        else {
            this.history.push({
                word: originalWord,
                result: false
            });
            this.comboCounter.reset();
        }
        this.showWord();
    }

    showWord(): void {
        if (this.view instanceof SprintMainView)
            this.view.showNewWord(this.getNextWord());
    }

    getNextWord(): SprintWord {
        const word: wordType = this.words[this.index];
        this.index = (this.index + 1) % this.words.length;
        // 60% of correct translations and 40% of incorrect (may skip filtering correct translation on else, this will
        // skew chances a bit)
        const chance = Math.random();
        if (chance < ChanceOfCorrect)
            return {
                word: word.word,
                translation: word.wordTranslate
            };
        else {
            let randomTranslation = this.translations[Math.floor(Math.random() * this.translations.length)];
            while (randomTranslation === word.wordTranslate)
                randomTranslation = this.translations[Math.floor(Math.random() * this.translations.length)];
            return {
                word: word.word,
                translation: randomTranslation
            };
        }
    }
}

