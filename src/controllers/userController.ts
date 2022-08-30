import { assertDefined, HOST, REFRESH_TOKEN_NAME, TOKEN_NAME, USER_NAME } from '../helpers/helpers';
import { signInResponceType } from '../helpers/types';
import RouterController from './routerController';

class UserController {
    private static instance: UserController;
    static getInstance(): UserController {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
    //after signin token save to localstorage as jwt, user as userId
    async signIn(email: string, password: string): Promise<void> {
        const res = await fetch(`${HOST}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        if (res.ok) {
            const { token, userId, refreshToken } = (await res.json()) as signInResponceType;
            localStorage.setItem(TOKEN_NAME, token);
            localStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
            localStorage.setItem(USER_NAME, userId);
            RouterController.getInstance().navigate('/');
        } else {
            const errMesage = assertDefined(document.querySelector<HTMLParagraphElement>('#errMesage'));
            errMesage.classList.toggle('hidden');
        }
    }
    async registration(): Promise<void> {
        const email = assertDefined(document.querySelector<HTMLInputElement>('#email')).value;
        const password = assertDefined(document.querySelector<HTMLInputElement>('#password')).value;
        const name = assertDefined(document.querySelector<HTMLInputElement>('#name')).value;
        const res = await fetch(`${HOST}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
        });
        if (res.ok) {
            await UserController.getInstance().signIn(email, password);
            RouterController.getInstance().navigate('/');
        } else {
            const errMesage = assertDefined(document.querySelector<HTMLParagraphElement>('#errMesage'));
            errMesage.classList.toggle('hidden');
        }
    }
    async getNewToken(): Promise<void> {
        const { userId, refreshToken } = localStorage;
        const url = `${HOST}/users/${userId}/tokens`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        if (response.ok) {
            const { token, refreshToken } = (await response.json()) as signInResponceType;
            localStorage.setItem(TOKEN_NAME, token);
            localStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
        } else if (response.status === 403 || response.status === 401) {
            this.logout();
        } else {
            throw Error(`Error update token. Status  ${response.status}`);
        }
    }
    logout(): void {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(REFRESH_TOKEN_NAME);
    }
    isSignin() {
        return localStorage.getItem(TOKEN_NAME) !== null;
    }
}

export default UserController;
