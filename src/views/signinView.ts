import UserController from '../controllers/userController';
import FormService from '../service/formService';
import ViewInterface from './viewInterface';

class SigninView extends ViewInterface {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = new UserController();
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
        const email = FormService.getInput(['login-form__login'], 'email', 'email...', 'email');
        form.append(email);
        const pass = FormService.getInput(['login-form__pass'], 'password', 'Пароль...', 'password');
        form.append(pass);
        const submit = FormService.getSubmitBtn(['login-form__submit'], 'Войти', this.controller.signIn);
        form.append(submit);
    }
}

export default SigninView