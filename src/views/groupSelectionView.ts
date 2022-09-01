import ViewInterface from "./viewInterface";

import './group-selection-view.css';

const template = document.createElement('template');
template.innerHTML = `
    <div class="selection">
        <div class="selection__card">
            <h3 class="selection__header">Выберите уровень сложности</h3>
            <div class="selection__button selection__button--0"> Группа 1</div>
            <div class="selection__button selection__button--1"> Группа 2</div>
            <div class="selection__button selection__button--2"> Группа 3</div>
            <div class="selection__button selection__button--3"> Группа 4</div>
            <div class="selection__button selection__button--4"> Группа 5</div>
            <div class="selection__button selection__button--5"> Группа 6</div>
        </div>
    </div>
`;


export default class GroupSelectionView extends ViewInterface {
    show(): void {
        this.rootElement.append(template.content.cloneNode(true));
    }
}