import RouterController from './routerController';
import { assertDefined } from '../helpers/helpers';
import UserController from './userController';

export default class AppController {
    constructor() {
        const router: RouterController = RouterController.getInstance();
        const userController: UserController = UserController.getInstance();
        const viewContainer: HTMLElement = assertDefined(document.querySelector('.content'));
        router.setRootElement(viewContainer);
        // If user is signed in, refresh token, then reopen current view. Else just reopen view
        if (userController.isSignin()) {
            console.log('signed');
            console.log('another');
            userController.getNewToken()
                .then(() => userController.startUpdateToken())
                .then(() => router.reOpenCurrent());
        }
        else router.reOpenCurrent();


        assertDefined(document.querySelector('#ebook')).addEventListener('click', () => router.navigate('/ebook'));
        assertDefined(document.querySelector('#audiocall')).addEventListener('click', () =>
            router.navigate('/level', '/audiocall')
        );
        assertDefined(document.querySelector('#sprint')).addEventListener('click', () =>
            router.navigate('/level', '/sprint')
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
