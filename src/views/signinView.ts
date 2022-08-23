import UserController from '../controllers/userController';
import { assertDefined } from '../helpers/helpers';
import FormService from '../service/formService';
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
        this.fillLoginForm(form);
        form.addEventListener('input', () =>
            assertDefined(form.querySelector<HTMLParagraphElement>('#errMesage')).classList.add('hidden')
        );
        this.rootElement.innerText = '';
        this.rootElement.append(form);
    }

    private fillLoginForm(form: HTMLElement) {
        const email = FormService.getInput(['login-form__login'], 'email', 'email...', 'email');
        form.append(email);
        const pass = FormService.getInput(['login-form__pass'], 'password', 'Пароль...', 'password');
        form.append(pass);
        const submit = FormService.getSubmitBtn(['login-form__submit'], 'Войти', this.controller.signIn);
        form.append(submit);
    }
}

export default SigninView;
