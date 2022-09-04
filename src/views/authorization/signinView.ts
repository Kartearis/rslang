import LoadingOverlay from '../../components/loadingOverlay';
import UserController from '../../controllers/userController';
import { assertDefined } from '../../helpers/helpers';
import Authorization from './authorization';
import './authView.css';
class SigninView extends Authorization {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = UserController.getInstance();
    }

    show(): void {
        const form = this.getAuthForm();
        form.classList.add('signin-form');
        this.fillLoginForm(form);
        form.addEventListener('input', (ev) => {
            // const target = ev.target as HTMLSelectElement;
            // console.log(target.checkValidity());
            assertDefined(form.querySelector<HTMLParagraphElement>('#errMesage')).classList.add('hidden');
        });
        this.rootElement.innerText = '';
        const formContainer = document.createElement('div');
        formContainer.classList.add('auth-container');
        formContainer.append(form);
        this.rootElement.append(formContainer);
    }

    private fillLoginForm(form: HTMLElement) {
        const email = this.getInput(['login-form__login'], 'email', 'Email...', 'email');
        form.append(email);
        const pass = this.getInput(['login-form__pass'], 'password', 'Пароль...', 'password');
        email.required = true;
        form.append(pass);
        pass.minLength = 8;
        pass.required = true;
        const submit = this.getSubmitBtn(['login-form__submit'], 'Войти', this.signinAction);
        form.append(submit);
    }
    private signinAction() {
        // const loadingOverlay = new LoadingOverlay(false).show();
        // try {
        //     this.rootElement.append(loadingOverlay);
        const email = assertDefined(document.querySelector<HTMLInputElement>('#email')).value;
        const password = assertDefined(document.querySelector<HTMLInputElement>('#password')).value;
        UserController.getInstance().signIn(email, password);
        // } finally {
        //     loadingOverlay.hide();
        // }
    }
}

export default SigninView;
