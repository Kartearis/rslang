import authorizationFormType from "../assets/views/authorization/authFormType";
import AuthorizationForm from "../assets/views/authorization/authorizationForm";
import SigninController from '../controllers/signinController';
import ViewInterface from './viewInterface';

class SigninView extends ViewInterface {
    controller: any;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = new SigninController();
    }

    show(): void {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        const form = document.createElement('div');
        form.classList.add('signin-form');
        this.fillLoginForm(form);
        form.addEventListener('input', () => form?.querySelector<HTMLParagraphElement>('#errMesage')!.classList.add('hidden'));
        formContainer.append(form);
        this.rootElement.innerText = '';
        this.rootElement.append(formContainer);
    }

    private fillLoginForm(form: HTMLElement) {
        const errMesage = document.createElement('p');
        errMesage.innerText = 'Неверный логин или пароль';
        errMesage.classList.add('errMesage');
        errMesage.classList.add('hidden');
        errMesage.id = 'errMesage';
        form.append(errMesage);
        const email = this.getInput(['login-form__login'], 'email', 'email...', 'email');
        form.append(email);
        const pass = this.getInput(['login-form__pass'], 'password', 'Пароль...', 'password');
        form.append(pass);
        const submit = this.getSubmitBtn(['login-form__submit'], 'Войти');
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
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        classes.forEach(c => submitBtn.classList.add(c));
        submitBtn.innerText = value;
        submitBtn.addEventListener('click', () => this.controller.signeUIn());
        return submitBtn;
    }
}

export default SigninView