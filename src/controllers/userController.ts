import { assertDefined, HOST } from '../helpers/helpers';
import RouterController from './routerController';

class UserController {
    private static instance: UserController;
    static getInstance(): UserController {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    async signIn(_email: string | null = null, _password: string | null = null): Promise<void> {
        const email =
            _email === null ? assertDefined(document.querySelector<HTMLInputElement>('#email')).value : _email;
        const password =
            _password === null ? assertDefined(document.querySelector<HTMLInputElement>('#password')).value : _password;

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
            const jwt = await res.json();
            localStorage.setItem('jwt', JSON.stringify(jwt));
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
        localStorage.removeItem('jwt');
        this.togleHeaderLink();
    }
    isSignin() {
        return localStorage.getItem('jwt') !== null;
    }
}

export default UserController;
