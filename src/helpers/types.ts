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
    userWord?: {
        difficulty: wordStatus
      }
};
type signInResponceType = {
    message: string,
    token: string,
    refreshToken: string,
    userId: string,
    name: string
  }
enum wordStatus { hard = 'hard', easy = 'easy'};
type wordProperty = {
    difficulty: string,
    optional: {}
  }
export { signInResponceType, wordType, wordStatus, wordProperty };
