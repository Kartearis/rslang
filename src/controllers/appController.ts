import RouterController from './routerController';
import { assertDefined } from '../helpers/helpers';

export default class AppController {
    constructor() {
        const router: RouterController = RouterController.getInstance();
        const viewContainer: HTMLElement = assertDefined(document.querySelector('.content'));
        router.setRootElement(viewContainer);
        router.reOpenCurrent();
        // tmp
        assertDefined(document.querySelector('#garage')).addEventListener('click', () => router.navigate('/'));
        assertDefined(document.querySelector('#records')).addEventListener('click', () => router.navigate('/test'));
        assertDefined(document.querySelector('#ebook')).addEventListener('click', () => router.navigate('/ebook'));
    }
}
