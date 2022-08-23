//word have id, but words has _id field and userWord obhect
type wordType = {
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
type signInResponceType = {
    message: string;
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
};
enum wordStatus {
    hard = 'hard',
    easy = 'easy',
}
type wordProperty = {
    difficulty: wordStatus;
    optional: {
        //linter error on empty object{}, after add any field remove id
        id?: number;
    };
};
export { signInResponceType, wordType, wordStatus, wordProperty };
