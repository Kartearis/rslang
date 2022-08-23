import UserController from '../controllers/userController';
import { assertDefined } from '../helpers/helpers';
import FormService from '../helpers/formService';
import ViewInterface from './viewInterface';
import './authView.css';
class RegistrationView extends ViewInterface {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = UserController.getInstance();
    }

    show(): void {
        const form = FormService.getAuthForm();
        this.fillRegistrationForm(form);
        form.addEventListener('input', () =>
            assertDefined(form.querySelector<HTMLParagraphElement>('#errMesage')).classList.add('hidden')
        );
        this.rootElement.innerText = '';
        this.rootElement.append(form);
    }

    private fillRegistrationForm(form: HTMLElement) {
        const name = FormService.getInput(['reg-form__name'], 'text', 'Имя...', 'name');
        form.append(name);
        const email = FormService.getInput(['reg-form__login'], 'email', 'email...', 'email');
        email.required = true;
        form.append(email);
        const pass = FormService.getInput(['reg-form__pass'], 'password', 'Пароль...', 'password');
        pass.minLength = 8;
        pass.required = true;
        form.append(pass);
        const submit = FormService.getSubmitBtn(['reg-form__submit'], 'Отправить', this.controller.registration);
        form.append(submit);
    }
}

export default RegistrationView;
