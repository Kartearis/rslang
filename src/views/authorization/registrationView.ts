import HeaderAction from '../../components/headerAction';
import LoadingOverlay from '../../components/loadingOverlay';
import UserController from '../../controllers/userController';
import { assertDefined } from '../../helpers/helpers';
import Authorization from './authorization';
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
        formContainer.classList.add('auth-container');
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
        const submit = this.getSubmitBtn(['reg-form__submit'], 'Регистрация', () => this.registrationAction());
        form.append(submit);
    }

    private async registrationAction(): Promise<void> {
        const email = assertDefined(document.querySelector<HTMLInputElement>('#email')).value;
        const password = assertDefined(document.querySelector<HTMLInputElement>('#password')).value;
        const name = assertDefined(document.querySelector<HTMLInputElement>('#name')).value;
        const loadingOverlay = new LoadingOverlay(true).show();
        this.rootElement.append(loadingOverlay);
        await UserController.getInstance()
            .registration(name, email, password)
            .then(
                () => {
                    loadingOverlay.hide();
                    HeaderAction.checkAuth();
                },
                () => {
                    const errMesage = assertDefined(document.querySelector<HTMLParagraphElement>('#errMesage'));
                    errMesage.classList.toggle('hidden');
                    loadingOverlay.hide();
                }
            );
    }
}

export default RegistrationView;
