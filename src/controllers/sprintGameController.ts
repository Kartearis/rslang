import ComboCounter from '../components/comboCounter';
import Timer from '../components/timer';
import ViewInterface from '../views/viewInterface';
import SprintIntroView from '../views/sprintGame/sprintIntroView';
import SprintMainView from '../views/sprintGame/sprintMainView';
import SprintOutroView from '../views/sprintGame/sprintOutroView';
import { wordType, wordGame } from '../helpers/types';
import { assertDefined, getHostPath } from '../helpers/helpers';
import GameController from './gameController';
import AudioController from './audioController';

import pingSound from '../assets/audio/ping.mp3';
import suspenseSound from '../assets/audio/suspense.mp3';
import DailyStatsController from './dailyStatsController';

const ChanceOfCorrect = 0.6;

export type SprintWord = {
    word: string;
    translation: string;
    audio: string;
};

type SoundKeys = 'ping' | 'word' | 'alert';

export default class SprintGameController extends GameController {
    // private words: wordType[] = []
    private history: wordGame[] = [];
    private translations: string[] = [];
    private comboCounter: ComboCounter;
    private timer: Timer;
    private view: ViewInterface | null = null;
    private rootElement: HTMLElement;
    private audioControllers: Record<SoundKeys, AudioController>;

    private points = 0;
    private index = 0;

    constructor(rootElement: HTMLElement, words: wordType[]) {
        super(words);
        this.dailyStatsController = new DailyStatsController('sprint-game');
        this.rootElement = rootElement;
        this.translations = this.words.map((word) => word.wordTranslate);
        this.timer = new Timer(60);
        this.comboCounter = new ComboCounter();
        this.audioControllers = {
            ping: new AudioController(pingSound).setVolume(0.3),
            word: new AudioController(getHostPath(this.words[0].audio)),
            alert: new AudioController(suspenseSound).setLoop().setVolume(0.5),
        };
        this.timer.setTimeStages([10]);
        this.timer.addEventListener('timeUp', () => this.showResults());
        this.timer.addEventListener('timeUp', () => this.stopSound('alert'));
        this.timer.addEventListener('timeStage', () => this.playSound('alert'));
    }

    showIntro(): void {
        this.view?.destroy();
        this.view = new SprintIntroView(this.rootElement, this);
        this.view.show();
    }

    startGame(): void {
        this.view?.destroy();
        this.view = new SprintMainView(this.rootElement, this.timer, this.comboCounter, this);
        this.index = 0;
        this.points = 0;
        this.history = [];
        this.comboCounter.reset();
        this.timer.stopTimer();
        this.view.show();
        this.showWord();
    }

    showResults(): void {
        this.view?.destroy();
        this.view = new SprintOutroView(this.rootElement, this, this.points, this.history);
        this.view.show();
        this.saveResult(this.history);
    }

    async playSound(controllerName: SoundKeys): Promise<void> {
        this.audioControllers[controllerName].reset();
        return this.audioControllers[controllerName].play();
    }

    stopSound(controllerName: SoundKeys): void {
        this.audioControllers[controllerName].pause();
    }

    toggleMute(): void {
        (Object.keys(this.audioControllers) as SoundKeys[]).forEach((key) => this.audioControllers[key].toggleMute());
    }

    isMute(): boolean {
        return Object.values(this.audioControllers).some((controller) => controller.isMute());
    }

    exit(): void {
        // TODO: Maybe make all timers on controller or all timers in views?
        this.timer.stopTimer();
        this.routerController.back();
    }

    continue(): void {
        this.timer.stopTimer();
        this.showIntro();
    }

    awardPoints(): void {
        const points = 20 * (this.comboCounter.combo + 1);
        this.points += points;
        if (this.view instanceof SprintMainView) this.view.updatePoints(this.points);
    }

    // TODO: String literals may be remade to enum
    handleUserAnswer(answer: 'wrong' | 'right', word: string, translation: string): void {
        const originalWord: wordType = assertDefined(this.words.find((w) => w.word === word));
        const correctAnswer = translation === originalWord.wordTranslate ? 'right' : 'wrong';
        if (correctAnswer === answer) {
            this.history.push({
                wordGame: originalWord,
                result: true,
            });
            this.awardPoints();
            this.comboCounter.up();
        } else {
            this.history.push({
                wordGame: originalWord,
                result: false,
            });
            this.comboCounter.reset();
        }
        this.playSound('ping');
        this.showWord();
    }

    showWord(): void {
        const newWord = this.getNextWord();
        // If no words available - finish the game
        if (newWord) {
            this.audioControllers['word'].loadPath(getHostPath(newWord.audio));
            if (this.view instanceof SprintMainView) this.view.showNewWord(newWord);
        } else this.showResults();
    }

    getNextWord(): SprintWord | null {
        if (this.index >= this.words.length) return null;
        const word: wordType = this.words[this.index];
        this.index += 1;
        // 60% of correct translations and 40% of incorrect (may skip filtering correct translation on else, this will
        // skew chances a bit)
        const chance = Math.random();
        if (chance < ChanceOfCorrect)
            return {
                word: word.word,
                translation: word.wordTranslate,
                audio: word.audio,
            };
        else {
            let randomTranslation = this.translations[Math.floor(Math.random() * this.translations.length)];
            while (randomTranslation === word.wordTranslate)
                randomTranslation = this.translations[Math.floor(Math.random() * this.translations.length)];
            return {
                word: word.word,
                translation: randomTranslation,
                audio: word.audio,
            };
        }
    }

    destroy(): void {
        this.view?.destroy();
        Object.values(this.audioControllers).forEach((audio) => audio.pause());
    }
}
