import RouterController from './routerController';
import { assertDefined } from '../helpers/helpers';
import CookieHelper from '../helpers/cookiehelper';

export default class AppController {
    constructor() {
        const router: RouterController = RouterController.getInstance();
        const viewContainer: HTMLElement = assertDefined(document.querySelector('.content'));
        router.setRootElement(viewContainer);
        router.reOpenCurrent();
        // tmp
        assertDefined(document.querySelector('#garage')).addEventListener('click', () => router.navigate('/'));
        assertDefined(document.querySelector('#records')).addEventListener('click', () => router.navigate('/test'));
        assertDefined(document.querySelector('#signin')).addEventListener('click', () => router.navigate('/signin'));
        assertDefined(document.querySelector('#registration')).addEventListener('click', () => router.navigate('/registration'));
        assertDefined(document.querySelector('#logout')).addEventListener('click', () => router.navigate('/logout'));
        if (CookieHelper.hasCookie('jwt')) {
            assertDefined(document.querySelector('#signin')).classList.add('hidden');
            assertDefined(document.querySelector('#registration')).classList.add('hidden');
        } else {
            assertDefined(document.querySelector('#logout')).classList.add('hidden');
        }
    }
}
