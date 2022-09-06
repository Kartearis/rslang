import { assertDefined, HOST, REFRESH_TOKEN_NAME, TOKEN_NAME, USER_NAME } from '../helpers/helpers';
import { signInResponceType as signInResponseType } from '../helpers/types';
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
            const { token, userId, refreshToken } = (await res.json()) as signInResponseType;
            localStorage.setItem(TOKEN_NAME, token);
            localStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
            localStorage.setItem(USER_NAME, userId);
            RouterController.getInstance().back();
            this.startUpdateToken();
        } else {
            throw Error('Signing error');
        }
    }
    async registration(name: string, email: string, password: string): Promise<void> {
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
            throw Error('Registration error');
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
            const { token, refreshToken } = (await response.json()) as signInResponseType;
            localStorage.setItem(TOKEN_NAME, token);
            localStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
        } else if (response.status === 403 || response.status === 401) {
            this.logout();
        } else {
            throw Error(`Error update token. Status  ${response.status}`);
        }
    }
    async startUpdateToken() {
        const milisecondsIn2Hours = 7200000;
        setInterval(async () => {
            await this.getNewToken();
        }, milisecondsIn2Hours);
    }
    logout(): void {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(REFRESH_TOKEN_NAME);
    }
    isSignin() {
        return localStorage.getItem(TOKEN_NAME) !== null;
    }

    get userId(): string {
        return assertDefined(localStorage.getItem(USER_NAME));
    }
}

export default UserController;
