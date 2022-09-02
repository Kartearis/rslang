import { HOST } from '../helpers/helpers';
import { wordProperty } from '../helpers/types';
import EBookController from './eBookController';

class UserWordController {
    private static instance: UserWordController;
    eBookController: EBookController;
    private constructor() {
        this.eBookController = EBookController.getInstance();
    }
    public static getInstance(): UserWordController {
        if (!UserWordController.instance) {
            UserWordController.instance = new UserWordController();
        }
        return UserWordController.instance;
    }

    async addUserWord(wordId: string, property: wordProperty): Promise<void> {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(property, (k, v) => (v === null ? 'null' : v)),
        });
        if (resp.ok) {
            this.eBookController.updateWord(wordId, property);
        } else {
            throw Error(`Can't add property fot word. Access token is missing or invalid`);
        }
    }
    async updateUserWord(wordId: string, property: wordProperty): Promise<void> {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(property, (k, v) => (v === null ? 'null' : v)),
        });
        if (resp.ok) {
            this.eBookController.updateWord(wordId, property);
        } else {
            throw Error(`Can't update property fot word. Access token is missing or invalid`);
        }
    }
    async deleteUserWord(userWordId: string) {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${userWordId}`, {
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
