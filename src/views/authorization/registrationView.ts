import UserController from '../../controllers/userController';
import { assertDefined } from '../../helpers/helpers';
import Authorization from './authorization';
import ViewInterface from '../viewInterface';
import './authView.css';
class RegistrationView extends Authorization {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = UserController.getInstance();
    }

    show(): void {
        const form = this.getAuthForm();
        form.classList.add('registration-form');
        this.fillRegistrationForm(form);
        form.addEventListener('input', () =>
            assertDefined(form.querySelector<HTMLParagraphElement>('#errMesage')).classList.add('hidden')
        );
        this.rootElement.innerText = '';
        const formContainer = document.createElement('div');
        formContainer.classList.add('auth-container')
        formContainer.append(form);
        this.rootElement.append(formContainer);
    }

    private fillRegistrationForm(form: HTMLElement) {
        const name = this.getInput(['reg-form__name'], 'text', 'Имя...', 'name');
        form.append(name);
        const email = this.getInput(['reg-form__login'], 'email', 'Email...', 'email');
        email.required = true;
        form.append(email);
        const pass = this.getInput(['reg-form__pass'], 'password', 'Пароль...', 'password');
        pass.minLength = 8;
        pass.required = true;
        form.append(pass);
        const submit = this.getSubmitBtn(['reg-form__submit'], 'Регистрация', this.controller.registration);
        form.append(submit);
    }
}

export default RegistrationView;
