import ViewInterface from './viewInterface';
import '../styles/main.css';
import img1 from '../assets/imgs/1.jpg';
import img2 from '../assets/imgs/2.jpg';
import img3 from '../assets/imgs/3.jpg';
import img4 from '../assets/imgs/4.jpg';
import img5 from '../assets/imgs/5.jpg';
import img6 from '../assets/imgs/6.jpg';

import imgDev1 from '../assets/imgs/dev1.png';
import imgDev2 from '../assets/imgs/dev2.png';
import imgDev3 from '../assets/imgs/dev3.jpg';

export default class MainView extends ViewInterface {
    // constructor(rootElement: HTMLElement) {
    //     super(rootElement);
    // }

    show(): void {
        this.rootElement.innerHTML = mainBody;
    }
}

const mainBody = `<div class="main-wrapper"><h1 class="main-title">RSLANG APP</h1>
                    <div class="advantage-block">
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img1}"><p class="advantage-block__text">Покажем куда расти</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img2}"><p class="advantage-block__text">Всего 15 минут в день</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img3}"><p class="advantage-block__text">Обучение в игровой форме, скучно не будет!</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img4}"><p class="advantage-block__text">Осторожно! Вызывает привыкание :) </<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img5}"><p class="advantage-block__text">Геймификация доказала свою эффективность для всех возрастов.</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img6}"><p class="advantage-block__text">Наша миссия - сделать изучение языков доступным для всех.</<p></div>
                    </div>
                    <H2 class="our-team-title">НАША КОМАНДА</H2>
                    <div class="team-block">
                        <div class="dev-card">
                            <img class="dev-card__img" src="${imgDev1}" width="50">
                            <a href="https://github.com/Kartearis">Kartearis</a>
                            <p>Игра1, игра2</p>
                        </div>
                                                <div class="dev-card">
                            <img class="dev-card__img" src="${imgDev2}" width="50">
                            <a href="https://github.com/Kartearis">Palasja</a>
                            <p>Игра1, игра2</p>
                        </div>
                                                <div class="dev-card">
                            <img class="dev-card__img" src="${imgDev3}" width="50">
                            <a href="https://github.com/Kartearis">Evg2Chainz</a>
                            <p>Игра1, игра2</p>
                        </div>
                        
                    </div>

</div>`;
