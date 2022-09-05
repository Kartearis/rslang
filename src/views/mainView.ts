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
    show(): void {
        this.rootElement.innerHTML = mainBody;
    }
}

const mainBody = `<div class="main-wrapper"><h1 class="main-title">RSLANG APP</h1>
                    <div class="advantage-block">
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img1}" alt="Диаграмма, направленная вверх"><p class="advantage-block__text">Покажем куда расти</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img2}" alt="Циферблат часов"><p class="advantage-block__text">Всего 15 минут в день</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img3}" alt="Ребёнок играет"><p class="advantage-block__text">Обучение в игровой форме, скучно не будет!</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img4}" alt="Группа людей вцепилась в телефон"><p class="advantage-block__text">Осторожно! Вызывает привыкание :) </<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img5}" alt="График высокой эффективности"><p class="advantage-block__text">Геймификация доказала свою эффективность для всех возрастов.</<p></div>
                        <div class="advantage-block__item"><img class="advantage-block__img" height="200" width="100%" src="${img6}" alt="Разные люди, иллюстрация инклюзивности"><p class="advantage-block__text">Наша миссия - сделать изучение языков доступным для всех.</<p></div>
                    </div>
                    <H2 class="our-team-title">НАША КОМАНДА</H2>
                    <div id="teamBlock" class="team-block">
                        <div class="dev-card">
                            <img class="dev-card__img" alt="Аватар гитхаба пользователя Kartearis" src="${imgDev1}" width="50">
                            <a href="https://github.com/Kartearis">Kartearis</a>
                            <ul class="dev-card__list">
                                <li class="dev-card__work">Тимлид</li>
                                <li class="dev-card__work">Роутинг</li>
                                <li class="dev-card__work">Игра "Спринт"</li>
                                <li class="dev-card__work">Статистика</li>
                                <li class="dev-card__work">Архитектура</li>
                                <li class="dev-card__work">Дизайн приложения</li>
                            </ul>
                        </div>
                        <div class="dev-card">
                            <img class="dev-card__img" alt="Аватар гитхаба пользователя Palasja" src="${imgDev2}" width="50">
                            <a href="https://github.com/Palasja">Palasja</a>
                            <ul class="dev-card__list">
                                <li class="dev-card__work">Взаимодействие с сервером</li>
                                <li class="dev-card__work">Авторизация</li>
                                <li class="dev-card__work">Дизайн (а также вёрстка и реализация) учебника</li>
                                <li class="dev-card__work">Игра "Аудиовызов"</li>
                                <li class="dev-card__work">Развёртывание сервера</li>
                            </ul>
                        </div>
                                                <div class="dev-card">
                            <img class="dev-card__img" alt="Аватар гитхаба пользователя Evg2Chainz" src="${imgDev3}" width="50">
                            <a href="https://github.com/Evg2ChainzDev">Evg2Chainz</a>
                            <ul class="dev-card__list">
                                <li class="dev-card__work">Первичный стайлгайд</li>
                                <li class="dev-card__work">Главная страница, Хедер, Футер</li>
                                <li class="dev-card__work">Адаптивность главной страницы, хедера и футера</li>
                            </ul>
                        </div>
                        
                    </div>

</div>`;
