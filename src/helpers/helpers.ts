export function assertDefined<Type>(value: Type): NonNullable<Type> {
    if (value === undefined || value === null) throw new Error('Asserted value is not defined!');
    return value as NonNullable<Type>;
}
export const HOST = 'https://rs-lang-proj.herokuapp.com';
export const TOKEN_NAME = 'jwt';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const USER_NAME = 'userId';
export const GROUP_NAME = 'group';
export const HARD_WORD_GROUP_NUM = 6;
export const WORDS_ON_PAGE = 20;
export const COUNT_GAME_RESPONSE_WORD = 4;
export const SUCCESS_ANSWER_FOR_LEARNED = 3;
