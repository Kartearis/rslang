import { assertDefined, SUCCESS_ANSWER_FOR_LEARNED } from '../helpers/helpers';
import { wordGame, wordProperty, wordStatus, wordType } from '../helpers/types';
import RouterController from './routerController';
import UserController from './userController';
import UserWordController from './userWordController';
type newProperty = {
    wordId: string,
    property: wordProperty,
    isNewWord: boolean,
}

abstract class GameController {
    protected words: wordType[];
    protected userWordController: UserWordController;
    protected userController: UserController;
    protected routerController: RouterController;
    constructor(_words: wordType[][] | wordType[]) {
        this.words = this.shuffleArray(_words);
        this.userWordController = UserWordController.getInstance();
        this.routerController = RouterController.getInstance();
        this.userController = UserController.getInstance();
    }
    private updateOptions(gameWords: wordGame[]): newProperty[] {
        const arrNewProperty: newProperty[] = [];
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
                arrNewProperty.push({
                    wordId: gameWord.wordGame.id,
                    property: gameWord.wordGame.userWord,
                    isNewWord: true,
                });
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
                arrNewProperty.push({
                    wordId: gameWord.wordGame.id,
                    property: gameWord.wordGame.userWord,
                    isNewWord: false,
                });

            }
        });
        return arrNewProperty;
    }
    protected saveResult(gameWords: wordGame[]): void {
        if (!this.userController.isSignin()) return;
        this.updateOptions(gameWords).forEach(async (newProperty) => {
            newProperty.isNewWord ?
                await this.userWordController.addUserWord(newProperty.wordId, newProperty.property) :
                await this.userWordController.updateUserWord(newProperty.wordId, newProperty.property);
        });

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
    private formatDate(date: Date) {
        const dd = date.getDate();
        const strDay = dd < 10 ? `0${dd.toString()}` : dd.toString();

        const mm = date.getMonth() + 1;
        const monthStr = mm < 10 ? `0${mm.toString()}` : mm.toString();

        return `${date.getFullYear()}-${monthStr}-${strDay}`;
    }

    continue() {
        // Override this method to add 'restart game' functionality and possibly some cleanup
    }

    exit() {
        // Override this method to add 'exit game' functionality and possibly some cleanup
    }
}

export default GameController;
