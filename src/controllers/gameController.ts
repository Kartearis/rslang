import { assertDefined, SUCCESS_ANSWER_FOR_LEARNED, formatDate } from '../helpers/helpers';
import { wordGame, wordStatus, wordType } from '../helpers/types';
import RouterController from './routerController';
import UserController from './userController';
import UserWordController from './userWordController';
import DailyStatsController, { DailyStats } from './dailyStatsController';

function fixFirstAttempt(firstAttempt: string | null) {
    if (firstAttempt === undefined || firstAttempt === null || firstAttempt === 'null') return formatDate(new Date());
    else return firstAttempt;
}

abstract class GameController {
    protected words: wordType[];
    protected userWordController: UserWordController;
    protected userController: UserController;
    protected routerController: RouterController;
    protected dailyStatsController: DailyStatsController | null = null;
    constructor(_words: wordType[][] | wordType[]) {
        this.words = this.shuffleArray(_words);
        this.userWordController = UserWordController.getInstance();
        this.routerController = RouterController.getInstance();
        this.userController = UserController.getInstance();
    }
    protected async saveResult(gameWords: wordGame[]): Promise<void> {
        if (!this.userController.isSignin()) return;
        const stats: DailyStats = DailyStatsController.getEmpty();
        let previousIsCorrect = false;
        let currentCombo = 0;
        // Wait for all data to be updated
        try {
            await Promise.all(
                gameWords.map(async (gameWord) => {
                    const date = new Date();
                    const curDateString = formatDate(date);
                    if (gameWord.result) stats.correctCnt += 1;
                    else stats.incorrectCnt += 1;
                    if (gameWord.result && previousIsCorrect) currentCombo += 1;
                    else if (gameWord.result && !previousIsCorrect) currentCombo = 1;
                    else if (!gameWord.result && previousIsCorrect)
                        if (currentCombo > stats.longestCombo) stats.longestCombo = currentCombo;
                    previousIsCorrect = gameWord.result;
                    if (
                        gameWord.wordGame?.userWord === undefined ||
                        gameWord.wordGame.userWord.optional.firstAttempt === null ||
                        gameWord.wordGame.userWord.optional.firstAttempt === undefined
                    )
                        stats.newCnt += 1;
                    //first appearance
                    if (gameWord.wordGame.userWord === undefined) {
                        gameWord.wordGame.userWord = {
                            difficulty: wordStatus.learning,
                            optional: {
                                failed: gameWord.result ? '0' : '1',
                                success: gameWord.result ? '1' : '0',
                                successRow: gameWord.result ? '1' : '0',
                                learnedDate: null,
                                firstAttempt: curDateString,
                                lastAttempt: curDateString,
                            },
                        };
                        await this.userWordController.addUserWord(gameWord.wordGame.id, gameWord.wordGame.userWord);
                    } else {
                        const options = gameWord.wordGame.userWord.optional;
                        if (gameWord.result) {
                            const successInRowAtemps = Number(options.successRow) + 1;
                            // If condition for learned is met, add to stats
                            if (successInRowAtemps >= SUCCESS_ANSWER_FOR_LEARNED) stats.learnedCnt += 1;
                            gameWord.wordGame.userWord = {
                                difficulty:
                                    successInRowAtemps >= SUCCESS_ANSWER_FOR_LEARNED
                                        ? wordStatus.easy
                                        : gameWord.wordGame.userWord.difficulty,
                                optional: {
                                    failed: options.failed,
                                    success: (Number(options.success) + 1).toString(),
                                    successRow: successInRowAtemps.toString(),
                                    learnedDate: successInRowAtemps === 3 ? curDateString : options.learnedDate,
                                    firstAttempt: fixFirstAttempt(options.firstAttempt),
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
                                    firstAttempt: fixFirstAttempt(options.firstAttempt),
                                    lastAttempt: curDateString,
                                },
                            };
                        }
                        await this.userWordController.updateUserWord(
                            assertDefined(gameWord.wordGame.id),
                            gameWord.wordGame.userWord
                        );
                    }
                })
            );
        } catch (e) {
            if ((e as Error).message == "Can't add property fot word. Access token is missing or invalid") {
            } else if ((e as Error).message == "Can't update property fot word. Access token is missing or invalid") {
            } else throw e;
        }
        // Handle case when history ends with correct answer
        if (currentCombo > stats.longestCombo) stats.longestCombo = currentCombo;
        if (this.dailyStatsController) this.dailyStatsController.updateStats(stats);
    }
    protected shuffleArray<T>(_arr: T[][] | T[], countWordsForGame: number | null = null): T[] {
        const arr: T[][] = _arr as T[][];
        arr.forEach((a) => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = this.getRandomNum(i + 1);
                [a[i], a[j]] = [a[j], a[i]];
            }
        });
        const flatArr = arr.flat();
        if (countWordsForGame === null) {
            return flatArr;
        }
        return flatArr.length > countWordsForGame ? flatArr : flatArr.slice(0, countWordsForGame);
        // if (countWordsForGame === null) {
        //     wordForGame = arr.flat();
        // } else {
        //     wordForGame = [...arr[0]];
        //     for (let i = 0; i < arr.length; i++) {
        //         if (wordForGame.length < countWordsForGame) {
        //             if (arr[i].length + wordForGame.length <= countWordsForGame) {
        //                 wordForGame = [...wordForGame, ...arr[i]];
        //             } else {
        //                 const diff = countWordsForGame - wordForGame.length;
        //                 wordForGame = [...wordForGame, ...arr[i].slice(0, diff)];
        //             }
        //         } else {
        //             break;
        //         }
        //     }
        // }

        // if (countWordsForGame !== null) {
        //     wordForGame = wordForGame.length > countWordsForGame ? wordForGame.slice(0, countWordsForGame) : wordForGame;
        // }
        // return wordForGame;
    }
    protected getRandomNum(max: number): number {
        return Math.floor(Math.random() * max);
    }
    // private formatDate(date: Date) {
    //     const dd = date.getDate();
    //     const strDay = dd < 10 ? `0${dd.toString()}` : dd.toString();
    //
    //     const mm = date.getMonth() + 1;
    //     const monthStr = mm < 10 ? `0${mm.toString()}` : mm.toString();
    //
    //     return `${date.getFullYear()}-${monthStr}-${strDay}`;
    // }

    continue() {
        // Override this method to add 'restart game' functionality and possibly some cleanup
    }

    exit() {
        // Override this method to add 'exit game' functionality and possibly some cleanup
    }
}

export default GameController;
