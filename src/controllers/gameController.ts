import { assertDefined, SUCCESS_ANSWER_FOR_LEARNED } from '../helpers/helpers';
import { wordGame, wordStatus, wordType } from '../helpers/types';
import RouterController from './routerController';
import UserWordController from './userWordController';

abstract class GameController {
    words: wordType[];
    userWordController;
    routerController;
    constructor(_words: wordType[]) {
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
        //Должен быть переход на страницу результата
        this.routerController.navigate('/ebook');
    }
    protected shuffleArray<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.getRandomNum(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    protected getRandomNum(max: number): number {
        return Math.floor(Math.random() * max);
    }
    private formatDate(date: Date) {
        let dd = date.getDate();
        let strDay = dd < 10 ? `0${dd.toString()}` : dd.toString();

        let mm = date.getMonth() + 1;
        let monthStr = mm < 10 ? `0${mm.toString()}` : mm.toString();

        return `${date.getFullYear()}-${monthStr}-${strDay}`;
    }
}

export default GameController;
