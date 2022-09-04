export function assertDefined<Type>(value: Type): NonNullable<Type> {
    if (value === undefined || value === null) throw new Error('Asserted value is not defined!');
    return value as NonNullable<Type>;
}

export function getHostPath(path: string) {
    return `${HOST}\\${path}`;
}

export function formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function scanDate(date: string): Date {
    return new Date(date);
}

export function typedKeys<Type>(obj: Type): (keyof Type)[] {
    return Object.keys(obj) as (keyof Type)[];
}

export function typedEntries<Type>(obj: Type): [keyof Type, Type[keyof Type]][] {
    return Object.entries(obj) as [keyof Type, Type[keyof Type]][];
}

export const HOST = 'https://rs-lang-proj.herokuapp.com';
export const TOKEN_NAME = 'jwt';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const USER_NAME = 'userId';
export const GROUP_NAME = 'group';
export const HARD_WORD_GROUP_NUM = 6;
export const WORDS_ON_PAGE = 20;
export const PAGE_ON_GROUP = 29;
export const COUNT_AUDIOCALL_RESPONSE_WORD = 5;
export const COUNT_AUDIOCALL_WORDS = 10;
export const SUCCESS_ANSWER_FOR_LEARNED = 3;
