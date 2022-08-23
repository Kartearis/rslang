import { assertDefined, HOST, TOKEN_NAME, USER_NAME } from '../helpers/helpers';
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
            const { token, userId } = (await res.json()) as signInResponceType;
            localStorage.setItem(TOKEN_NAME, token);
            localStorage.setItem(USER_NAME, userId);
            UserController.getInstance().togleHeaderLink();
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
    togleHeaderLink(): void {
        assertDefined(document.querySelector('#signin')).classList.toggle('hidden');
        assertDefined(document.querySelector('#registration')).classList.toggle('hidden');
        assertDefined(document.querySelector('#logout')).classList.toggle('hidden');
    }
    logout(): void {
        localStorage.removeItem(TOKEN_NAME);
        this.togleHeaderLink();
    }
    isSignin() {
        return localStorage.getItem(TOKEN_NAME) !== null;
    }
}

export default UserController;
