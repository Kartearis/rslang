export function assertDefined<Type>(value: Type): NonNullable<Type> {
    if (value === undefined || value === null) throw new Error('Asserted value is not defined!');
    return value as NonNullable<Type>;
}
export const HOST = 'https://rs-lang-proj.herokuapp.com';
export const TOKEN_NAME = 'jwt';
export const USER_NAME = 'userId';
export const HARD_WORD_PAGE_NUM = 6;
