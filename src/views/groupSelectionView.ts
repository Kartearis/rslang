import ViewInterface from './viewInterface';

import './group-selection-view.css';
import EBookController from '../controllers/eBookController';
import { assertDefined } from '../helpers/helpers';
import RouterController from '../controllers/routerController';
import LoadingOverlay from '../components/loadingOverlay';

const template = document.createElement('template');
template.innerHTML = `
    <div class="selection">
        <div class="selection__card">
            <h3 class="selection__header">Выберите уровень сложности</h3>
            <div class="selection__button selection__button--0" data-group="1"> Группа 1</div>
            <div class="selection__button selection__button--1" data-group="2"> Группа 2</div>
            <div class="selection__button selection__button--2" data-group="3"> Группа 3</div>
            <div class="selection__button selection__button--3" data-group="4"> Группа 4</div>
            <div class="selection__button selection__button--4" data-group="5"> Группа 5</div>
            <div class="selection__button selection__button--5" data-group="6"> Группа 6</div>
        </div>
    </div>
`;

export default class GroupSelectionView extends ViewInterface {
    show(): void {
        this.rootElement.innerHTML = '';
        const bookController = EBookController.getInstance();
        const router = RouterController.getInstance();
        // This view requires auxData to know where to go next
        assertDefined(this.auxData);
        const next: string = this.auxData as string;
        this.rootElement.append(template.content.cloneNode(true));
        assertDefined(this.rootElement.querySelector('.selection__card')).addEventListener('click', async (event) => {
            const target = event.target as HTMLElement;
            if (target.dataset.group) {
                const loadingOverlay = new LoadingOverlay(false).show();
                this.rootElement.append(loadingOverlay);
                const words = await bookController.getGroupWords(parseInt(target.dataset.group));
                loadingOverlay.hide();
                router.navigate(next, words);
            }
        });
    }
}
