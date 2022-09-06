import { assertDefined } from '../../helpers/helpers';
import ViewInterface from '../viewInterface';

abstract class Authorization extends ViewInterface {
    protected errorMessage = 'Некоректный логин или пароль';
    protected getInput(classes: string[], type: string, placeholder: string, name: string) {
        const input = document.createElement('input');
        classes.forEach((cls) => input.classList.add(cls));
        input.type = type;
        input.placeholder = placeholder;
        input.name = name;
        input.id = name;
        return input;
    }

    protected getSubmitBtn(classes: string[], value: string, action: () => Promise<void>) {
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.disabled = true;
        classes.forEach((c) => submitBtn.classList.add(c));
        submitBtn.value = value;
        submitBtn.addEventListener('click', async (ev) => {
            ev.preventDefault();
            action();
        });
        return submitBtn;
    }
    protected getAuthForm(): HTMLFormElement {
        const form = document.createElement('form');
        const errMesage = document.createElement('p');
        errMesage.innerText = this.errorMessage;
        errMesage.classList.add('errMesage');
        errMesage.classList.add('hidden');
        errMesage.id = 'errMesage';
        form.append(errMesage);
        form.addEventListener('input', () => {
            const email = assertDefined(document.querySelector<HTMLInputElement>('input[type=email]'));
            const password = assertDefined(document.querySelector<HTMLInputElement>('input[type=password]'));
            const submit = assertDefined(document.querySelector<HTMLInputElement>('input[type=submit]'));
            submit.disabled = !(email.checkValidity() && password.checkValidity());
        });
        return form;
    }
}

export default Authorization;
