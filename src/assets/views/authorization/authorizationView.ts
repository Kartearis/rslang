import authorizationFormType from "./authFormType";
import AuthorizationForm from "./authorizationForm";

class Authorization{
    container: HTMLElement;
    constructor(_container: HTMLElement){
        this.container = _container;
    }
    drawAuthContainer(){
        const authBlock = document.createElement('div');
        authBlock.classList.add('auth-block');
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        const authorizationForm = new AuthorizationForm(formContainer);
        const loginBtn = document.createElement('button');
        loginBtn.innerText = 'Вход';
        loginBtn.addEventListener('click', () => authorizationForm.darwForm(authorizationFormType.login));
        const regBtn = document.createElement('button');
        regBtn.addEventListener('click', () => authorizationForm.darwForm(authorizationFormType.registration));
        regBtn.innerText = 'Регистрация';
        authorizationForm.darwForm(authorizationFormType.login);
        authBlock.append(loginBtn);
        authBlock.append(regBtn);
        authBlock.append(formContainer);
        this.container.append(authBlock);
    }
}

export default Authorization