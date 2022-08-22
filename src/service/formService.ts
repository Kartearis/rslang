class FormService {
    static getInput(classes: string[], type: string, placeholder: string, name: string) {
        const input = document.createElement('input');
        classes.forEach((cls) => input.classList.add(cls));
        input.type = type;
        input.placeholder = placeholder;
        input.name = name;
        input.id = name;
        return input;
    }

    static getSubmitBtn(classes: string[], value: string, action: () => void) {
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        classes.forEach((c) => submitBtn.classList.add(c));
        submitBtn.innerText = value;
        submitBtn.addEventListener('click', () => action());
        return submitBtn;
    }
}

export default FormService;
