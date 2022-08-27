import { HOST } from '../helpers/helpers';
import { wordProperty } from '../helpers/types';

class UserWordController {
    private static instance: UserWordController;

    public static getInstance(): UserWordController {
        if (!UserWordController.instance) {
            UserWordController.instance = new UserWordController();
        }
        return UserWordController.instance;
    }

    async addUserWord(wordId: string, word: wordProperty): Promise<void> {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(word),
        });
        if (!resp.ok) {
            throw Error('Access token is missing or invalid');
        }
    }
    async updateUserWord(wordId: string, word: wordProperty) {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(word),
        });
        if (!resp.ok) {
            throw Error('Access token is missing or invalid');
        }
    }
    async deleteUserWord(wordId: string) {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json',
            },
        });
        if (!resp.ok) {
            throw Error('Access token is missing or invalid');
        }
    }
}

export default UserWordController;
