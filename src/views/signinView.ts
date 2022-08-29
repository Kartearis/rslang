import UserController from '../controllers/userController';
import { assertDefined } from '../helpers/helpers';
import FormService from '../helpers/formService';
import ViewInterface from './viewInterface';
import './authView.css';
class SigninView extends ViewInterface {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = UserController.getInstance();
    }

    show(): void {
        const form = FormService.getAuthForm();
        form.classList.add('signin-form');
        this.fillLoginForm(form);
        form.addEventListener('input', () =>
            assertDefined(form.querySelector<HTMLParagraphElement>('#errMesage')).classList.add('hidden')
        );
        this.rootElement.innerText = '';
        const formContainer = document.createElement('div');
        formContainer.classList.add('auth-container')
        formContainer.append(form);
        this.rootElement.append(formContainer);
    }

    private fillLoginForm(form: HTMLElement) {
        const email = FormService.getInput(['login-form__login'], 'email', 'Email...', 'email');
        form.append(email);
        const pass = FormService.getInput(['login-form__pass'], 'password', 'Пароль...', 'password');
        email.required = true;
        form.append(pass);
        pass.minLength = 8;
        pass.required = true;
        const submit = FormService.getSubmitBtn(['login-form__submit'], 'Войти', this.signinAction);
        form.append(submit);
    }
    private signinAction() {
        const email = assertDefined(document.querySelector<HTMLInputElement>('#email')).value;
        const password = assertDefined(document.querySelector<HTMLInputElement>('#password')).value;
        UserController.getInstance().signIn(email, password);
    }
}

export default SigninView;
;