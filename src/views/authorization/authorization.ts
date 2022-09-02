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

    protected getSubmitBtn(classes: string[], value: string, action: () => void) {
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        classes.forEach((c) => submitBtn.classList.add(c));
        submitBtn.value = value;
        submitBtn.addEventListener('click', () => action());
        return submitBtn;
    }
    protected getAuthForm(): HTMLDivElement {
        const form = document.createElement('div');
        const errMesage = document.createElement('p');
        errMesage.innerText = this.errorMessage;
        errMesage.classList.add('errMesage');
        errMesage.classList.add('hidden');
        errMesage.id = 'errMesage';
        form.append(errMesage);
        return form;
    }
}

export default Authorization;
