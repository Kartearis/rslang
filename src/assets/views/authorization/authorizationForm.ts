import authorizationFormType from "./authFormType";
class AuthorizationForm {
    container: HTMLElement;
    constructor(_container: HTMLElement){
        this.container = _container;
    }
    darwForm( formType: authorizationFormType){
        document.querySelector('.auth-form')?.remove();
        const form = document.createElement('form'); 
        form.classList.add('auth-form');
        formType === authorizationFormType.login ? this.fillLoginForm(form) : this.fillRegistrationForm(form);
        this.container.append(form);
    }
    private fillLoginForm(form: HTMLFormElement){
        const email = this.getInput(['login-form__login'], 'email', 'email...');
        form.append( email );
        const pass = this.getInput(['login-form__pass'], 'password', 'Пароль...');
        form.append( pass );
        const submit = this.getSubmitBtn(['login-form__submit'], 'Войти');
        form.append( submit );
    }
    private fillRegistrationForm(form: HTMLFormElement){
        const name = this.getInput(['reg-form__name'], 'text', 'Имя...');
        form.append( name );
        const email = this.getInput(['reg-form__login'], 'email', 'email...');
        form.append( email );
        const pass = this.getInput(['reg-form__pass'], 'password', 'Пароль...');
        form.append( pass );
        const submit = this.getSubmitBtn(['reg-form__submit'], 'Отправить');
        form.append( submit );
    }
    private getInput(classes: string[], type: string, placeholder: string){
        const input = document.createElement('input'); 
        classes.forEach(cls => input.classList.add(cls));
        input.type = type;
        input.placeholder = placeholder;
        return input;
    }

    private getSubmitBtn(classes: string[], value: string){
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit'; 
        classes.forEach(c => submitBtn.classList.add(c));
        submitBtn.value = value;
        return submitBtn;
    }
}
export default AuthorizationForm