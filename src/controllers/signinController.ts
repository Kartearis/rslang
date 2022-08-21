import { HOST } from '../helpers/helpers';

class SigninController {
    async signeUIn() {
        const email = document.querySelector<HTMLInputElement>('#email');
        const password = document.querySelector<HTMLInputElement>('#password');

        const res = await fetch(`${HOST}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email?.value,
                password: password?.value
            })
        });
        if (res.ok) {
            const jwt = await res.json();
            sessionStorage.setItem('jwt', jwt);
        } else {
            const errMesage = document.querySelector<HTMLParagraphElement>('#errMesage')!;
            errMesage.classList.toggle('hidden');
        }
    }
}

export default SigninController;