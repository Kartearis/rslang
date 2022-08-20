import authorizationFormType from "./authFormType";
import './authorization.css'
const HOST = 'https://rs-lang-proj.herokuapp.com';

class AuthorizationForm {
    container: HTMLElement;
    constructor(_container: HTMLElement) {
        this.container = _container;
    }
    darwForm(formType: authorizationFormType) {
        document.querySelector('.auth-form')?.remove();
        const form = document.createElement('div');
        form.classList.add('auth-form');
        formType === authorizationFormType.login ? this.fillLoginForm(form) : this.fillRegistrationForm(form);
        form.addEventListener('input', () => form?.querySelector<HTMLParagraphElement>('#errMesage')!.classList.add('hidden'));
        this.container.append(form);
    }
    private fillLoginForm(form: HTMLElement) {
        const email = this.getInput(['login-form__login'], 'email', 'email...', 'email');
        form.append(email);
        const pass = this.getInput(['login-form__pass'], 'password', 'Пароль...', 'password');
        form.append(pass);
        const errMesage = document.createElement('p');
        errMesage.innerText = 'Неверный логин или пароль';
        errMesage.classList.add('errMesage');
        errMesage.classList.add('hidden');
        errMesage.id = 'errMesage';
        form.append(errMesage);
        const submit = this.getSubmitBtn(['login-form__submit'], 'Войти');
        form.append(submit);
    }
    private fillRegistrationForm(form: HTMLElement) {
        const name = this.getInput(['reg-form__name'], 'text', 'Имя...', 'name');
        form.append(name);
        const email = this.getInput(['reg-form__login'], 'email', 'email...', 'email');
        form.append(email);
        const pass = this.getInput(['reg-form__pass'], 'password', 'Пароль...', 'password');
        form.append(pass);
        const submit = this.getSubmitBtn(['reg-form__submit'], 'Отправить');
        form.append(submit);
    }
    private getInput(classes: string[], type: string, placeholder: string, name: string,) {
        const input = document.createElement('input');
        classes.forEach(cls => input.classList.add(cls));
        input.type = type;
        input.placeholder = placeholder;
        input.name = name;
        input.id = name;
        return input;
    }

    private getSubmitBtn(classes: string[], value: string) {
        const submitBtn = document.createElement('button');
        classes.forEach(c => submitBtn.classList.add(c));
        submitBtn.innerText = value;
        submitBtn.addEventListener('click', () => this.signeUIn());
        return submitBtn;
    }

    private async signeUIn() {
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
export default AuthorizationForm