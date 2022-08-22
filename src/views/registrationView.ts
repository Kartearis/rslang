import UserController from '../controllers/userController';
import { assertDefined } from '../helpers/helpers';
import FormService from '../service/formService';
import ViewInterface from './viewInterface';

class RegistrationView extends ViewInterface {
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
        this.fillRegistrationForm(form);
        form.addEventListener('input', () =>
            assertDefined(form.querySelector<HTMLParagraphElement>('#errMesage')).classList.add('hidden')
        );
        formContainer.append(form);
        this.rootElement.innerText = '';
        this.rootElement.append(formContainer);
    }

    private fillRegistrationForm(form: HTMLElement) {
        const errMesage = document.createElement('p');
        errMesage.innerText = 'Некоректный логин или пароль';
        errMesage.classList.add('errMesage');
        errMesage.classList.add('hidden');
        errMesage.id = 'errMesage';
        form.append(errMesage);
        const name = FormService.getInput(['reg-form__name'], 'text', 'Имя...', 'name');
        form.append(name);
        const email = FormService.getInput(['reg-form__login'], 'email', 'email...', 'email');
        form.append(email);
        const pass = FormService.getInput(['reg-form__pass'], 'password', 'Пароль...', 'password');
        form.append(pass);
        const submit = FormService.getSubmitBtn(['reg-form__submit'], 'Отправить', this.controller.registration);
        form.append(submit);
    }
}

export default RegistrationView;
