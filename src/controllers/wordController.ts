import { HOST, TOKEN_NAME } from "../helpers/helpers";
import { wordProperty, wordStatus } from "../helpers/types";


class UserWordController {
    private static instance: UserWordController;

    public static getInstance(): UserWordController {
        if (!UserWordController.instance) {
            UserWordController.instance = new UserWordController();
        }
        return UserWordController.instance;
    }

    async addUserWord(wordId: string, word: wordProperty, succesAction: () => void) {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        });
        if (resp.ok) {
            succesAction();
        }
    }
    async updateUserWord(wordId: string, word: wordProperty, succesAction: () => void) {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        });
        if (resp.ok) {
            succesAction();
        }
    }
    async deleteUserWord(wordId: string, succesAction: () => void) {
        const { jwt, userId } = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/json',
            },
        });
        if (resp.ok) {
            succesAction();
        }
    }
}

export default UserWordController