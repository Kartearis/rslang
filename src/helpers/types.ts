//word have id, but words has _id field and userWord obhect
export type wordType = {
    id: string;
    _id?: string;
    group: 0;
    page: 0;
    word: string;
    image: string;
    audio: string;
    audioMeaning: string;
    audioExample: string;
    textMeaning: string;
    textExample: string;
    transcription: string;
    wordTranslate: string;
    textMeaningTranslate: string;
    textExampleTranslate: string;
    userWord?: wordProperty;
};
export type signInResponceType = {
    message: string;
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
};
export enum wordStatus {
    hard = 'hard',
    easy = 'easy',
}
export enum filterForUserWords {
    hard = '{"userWord.difficulty":"hard"}',
    learned = '{"userWord":{"$exists":"true"}}',
    
}
export type wordProperty = {
    difficulty: wordStatus;
    optional: {
        //linter error on empty object{}, after add any field remove id
        id?: number;
    };
};
export type userWordIndo  =  wordProperty & {
    id:string;
    wordId:string;
};
export type responceUserWords = [
    {
        paginatedResults: wordType[];
        //all words whith mark
        totalCount: [
            {
                count: string;
            }
        ];
    }
];
