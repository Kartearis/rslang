import './login.css';
import './loginTemplate.html';

class Login {
    container: HTMLElement;
    constructor(_container: HTMLElement){
        this.container = _container;
    }

    drawLoginForm(){
        const form = document.createElement('form'); 
        form.classList.add('login-form');
        const login = this.getInput(['login-form__login'], 'email', 'email...');
        form.append( login );
        const pass = this.getInput(['login-form__pass'], 'password', 'password...');
        form.append( pass );
        const submit = this.getSubmitBtn(['login-form__submit'], 'Войти');
        form.append( submit );
        const loginContainer = document.createElement('div'); 
        loginContainer.classList.add('login');
        loginContainer.append(form);
        this.container.append(loginContainer);
    }

    getInput(classes: string[], type: string, placeholder: string){
        const input = document.createElement('input'); 
        classes.forEach(cls => input.classList.add(cls));
        input.type = type;
        input.placeholder = placeholder;
        return input;
    }

    getSubmitBtn(classes: string[], value: string){
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit'; 
        classes.forEach(cls => submitBtn.classList.add(cls));
        submitBtn.value = value;
        return submitBtn;
    }
}

export default Login;