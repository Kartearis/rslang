import ViewInterface from "./viewInterface";
import SprintGameController from "../controllers/sprintGameController";
import {wordType} from "../helpers/types";


export default class SprintGameView extends ViewInterface {
    private controller: SprintGameController | null = null

    show() {
        const words: wordType[] = [
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Cat',
                image: '--',
                audio: 'files/01_0010.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Кот',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Dog',
                image: '--',
                audio: 'files/01_0010.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Собака',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Up',
                image: '--',
                audio: 'files/01_0019.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Вверх',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Down',
                image: '--',
                audio: 'files/01_0010.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Вниз',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Example',
                image: '--',
                audio: 'files/01_0010.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Пример',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Plane',
                image: '--',
                audio: 'files/01_0019.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Самолёт',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Programmer',
                image: '--',
                audio: 'files/01_0019.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Программист',
                transcription: 'kat'
            },
            {
                id: '123',
                group: 0,
                page: 0,
                word: 'Cut',
                image: '--',
                audio: 'files/01_0010.mp3',
                audioMeaning: '--',
                audioExample: '--',
                textMeaning: '--',
                textExample: '--',
                textExampleTranslate: '--',
                textMeaningTranslate: '--',
                wordTranslate: 'Порез',
                transcription: 'kat'
            }
        ];
        this.controller = new SprintGameController(this.rootElement, words);
        this.controller.showIntro();
        // this.controller.showResults();
    }
}