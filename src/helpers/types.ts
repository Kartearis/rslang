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
    learning = 'learning',
}
export type wordProperty = {
    difficulty: wordStatus;
    optional: {
        failed: string | null;
        success: string | null;
        successRow: string | null;
        learnedDate: string | null;
        firstAttempt: string | null;
        lastAttempt: string | null;
    };
};
// TODO: refactor wordGame field to word
export type wordGame = {
    wordGame: wordType;
    result: boolean;
};
export type audiocallWord = wordGame & {
    //mark right or wrong word on page
    right: boolean;
};
export type responceUserWords = [
    {
        paginatedResults: wordType[];
        //all words whith option
        totalCount: [
            {
                count: string;
            }
        ];
    }
];
