import RouterController from './routerController';
import { assertDefined } from '../helpers/helpers';
import UserController from './userController';

export default class AppController {
    constructor() {
        const router: RouterController = RouterController.getInstance();
        const userController: UserController = UserController.getInstance();
        const viewContainer: HTMLElement = assertDefined(document.querySelector('.content'));
        userController.getNewToken().then((isAuth) => {
            isAuth ? console.log('Auth') : console.log('Not auth');
        })
        router.setRootElement(viewContainer);
        router.reOpenCurrent();
        // tmp
        assertDefined(document.querySelector('#garage')).addEventListener('click', () => router.navigate('/'));
        assertDefined(document.querySelector('#records')).addEventListener('click', () => router.navigate('/test'));
        assertDefined(document.querySelector('#ebook')).addEventListener('click', () => router.navigate('/ebook'));
        assertDefined(document.querySelector('#audiocall')).addEventListener('click', () =>
            router.navigate('/audocall')
        );
        assertDefined(document.querySelector('#signin')).addEventListener('click', () => router.navigate('/signin'));
        assertDefined(document.querySelector('#registration')).addEventListener('click', () =>
            router.navigate('/registration')
        );
        assertDefined(document.querySelector('#logout')).addEventListener('click', () => router.navigate('/logout'));
        //hidde signin and registration button after reload page

        if (userController.isSignin()) {
            assertDefined(document.querySelector('#signin')).classList.add('hidden');
            assertDefined(document.querySelector('#registration')).classList.add('hidden');
        } else {
            assertDefined(document.querySelector('#logout')).classList.add('hidden');
        }
    }
}
