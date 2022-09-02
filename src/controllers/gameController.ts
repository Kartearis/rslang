import { assertDefined, SUCCESS_ANSWER_FOR_LEARNED } from '../helpers/helpers';
import { wordGame, wordStatus, wordType } from '../helpers/types';
import RouterController from './routerController';
import UserWordController from './userWordController';

abstract class GameController {
    protected words: wordType[];
    protected userWordController: UserWordController;
    protected routerController: RouterController;
    constructor(_words: wordType[][] | wordType[]) {
        this.words = this.shuffleArray(_words);
        this.userWordController = UserWordController.getInstance();
        this.routerController = RouterController.getInstance();
    }
    protected saveResult(gameWords: wordGame[]): void {
        gameWords.forEach(async (gameWord) => {
            const date = new Date();
            const curDateString = this.formatDate(date);

            //first appearance
            if (gameWord.wordGame.userWord === undefined) {
                gameWord.wordGame.userWord = {
                    difficulty: wordStatus.learning,
                    optional: {
                        failed: gameWord.result ? '0' : '1',
                        success: gameWord.result ? '1' : '0',
                        successRow: gameWord.result ? '1' : '0',
                        learnedDate: null,
                        lastAttempt: curDateString,
                    },
                };
                await this.userWordController.addUserWord(gameWord.wordGame.id, gameWord.wordGame.userWord);
            } else {
                const options = gameWord.wordGame.userWord.optional;
                if (gameWord.result) {
                    const successInRowAtemps = Number(options.successRow) + 1;
                    gameWord.wordGame.userWord = {
                        difficulty:
                            successInRowAtemps >= SUCCESS_ANSWER_FOR_LEARNED ? wordStatus.easy : wordStatus.learning,
                        optional: {
                            failed: options.failed,
                            success: (Number(options.success) + 1).toString(),
                            successRow: successInRowAtemps.toString(),
                            learnedDate: successInRowAtemps === 3 ? curDateString : options.learnedDate,
                            lastAttempt: curDateString,
                        },
                    };
                } else {
                    gameWord.wordGame.userWord = {
                        //if word was easy change to learning
                        difficulty:
                            gameWord.wordGame.userWord.difficulty === wordStatus.hard
                                ? wordStatus.hard
                                : wordStatus.learning,
                        optional: {
                            failed: (Number(options.failed) + 1).toString(),
                            success: options.success,
                            successRow: '0',
                            learnedDate: null,
                            lastAttempt: curDateString,
                        },
                    };
                }
                await this.userWordController.updateUserWord(
                    assertDefined(gameWord.wordGame.id),
                    gameWord.wordGame.userWord
                );
            }
        });
    }
    protected shuffleArray<T>(_arr: T[][] | T[], countWordsForGame: number | null = null): T[] {
        countWordsForGame = 5;
        let arr: T[][] = _arr as T[][];
        let wordForGame: T[] = [];
        debugger
        if (countWordsForGame === null) {
            wordForGame = arr.flat();
        } else {
            debugger
            wordForGame = [...arr[0]];
            for (let i = 0; i < arr.length; i++) {
                if (wordForGame.length < countWordsForGame) {
                    if (arr[i].length + wordForGame.length <= countWordsForGame) {
                        wordForGame = [...wordForGame, ...arr[i]];
                    } else {
                        const diff = countWordsForGame - wordForGame.length;
                        wordForGame = [...wordForGame, ...arr[i].slice(0, diff)];
                    }
                } else {
                    break;
                }
            }
        }
        for (let i = wordForGame.length - 1; i > 0; i--) {
            const j = this.getRandomNum(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        if (countWordsForGame !== null) {
            wordForGame = wordForGame.length > countWordsForGame ? wordForGame.slice(0, countWordsForGame) : wordForGame;
        }
        return wordForGame;
    }
    protected getRandomNum(max: number): number {
        return Math.floor(Math.random() * max);
    }
    private formatDate(date: Date) {
        const dd = date.getDate();
        const strDay = dd < 10 ? `0${dd.toString()}` : dd.toString();

        const mm = date.getMonth() + 1;
        const monthStr = mm < 10 ? `0${mm.toString()}` : mm.toString();

        return `${date.getFullYear()}-${monthStr}-${strDay}`;
    }
}

export default GameController;
