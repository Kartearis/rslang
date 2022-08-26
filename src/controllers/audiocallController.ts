import { assertDefined, COUNT_GAME_RESPONSE_WORD } from "../helpers/helpers";
import { wordForGame, wordType } from "../helpers/types";
import AudiocallView from "../views/audiocallView";

class AudiocallController{
    words: wordType[];
    results: boolean[];
    counter = 0;
    constructor(_words:wordType[]){
        this.words = this.shufleArray(_words);
        this.results = new Array(_words.length);
    }
    getNextWord():wordForGame[]{
        this.counter += 1;
        return this.getResponseWords();
    }
    getResponseWords():wordForGame[]{
        const responseOptionsIndex = this.getResponseWordId(this.counter);
        const responseOptionsWords = responseOptionsIndex.map<wordForGame>(index => {
            const word = this.words[index];
            const id = word._id === undefined ? '' : word._id;
            return {
                _id: id,
                audio: word.audio,
                image:word.image,
                word: word.word,
                wordTranslate: word.wordTranslate,
                rigth: index === this.counter ? true : false,
            };
        });
        return responseOptionsWords;
    }
    saveResult(res: boolean){
        this.results[this.counter] = res;
    }
    private getResponseWordId(curentWordId: number): number[] {
        let arrId = [curentWordId];
        let testId = -1;
        while (arrId.length !== COUNT_GAME_RESPONSE_WORD) {
            testId = this.getRandomNum(this.words.length);
            if (!arrId.includes(testId)) {
                arrId.push(testId);
            }
        }
        const shufledArr = this.shufleArray(arrId);
        return shufledArr;
    }
    private shufleArray<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = this.getRandomNum(i+1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    private getRandomNum(max: number): number {
        return Math.floor(Math.random() * max)
    }
}

export default AudiocallController