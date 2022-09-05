import RouterController from '../controllers/routerController';
import { assertDefined } from '../helpers/helpers';

class HeaderAction {
    static addAction() {
        const burgerBtn = assertDefined(document.querySelector<HTMLButtonElement>('.burger'));
        const menu = assertDefined(document.querySelector('.menu-list'));
        const coverLayer = assertDefined(document.querySelector('.cover-layer'));

        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            menu.classList.toggle('active');
            coverLayer.classList.toggle('active');
        });

        coverLayer.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            menu.classList.remove('active');
            coverLayer.classList.remove('active');
        });

        document.querySelectorAll('.menu-list__menu-link').forEach((a) => {
            a.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                menu.classList.remove('active');
                coverLayer.classList.remove('active');
            });
        });

        const signBtn = assertDefined(document.querySelector('#signIcon'));
        const userIcon = assertDefined(document.querySelector('#userIcon'));

        signBtn.addEventListener('click', () => {
            assertDefined(document.querySelector('#userMenu')).classList.toggle('hidden');
        });
        userIcon.addEventListener('click', () => {
            assertDefined(document.querySelector('#userMenu')).classList.toggle('hidden');
        });
        RouterController.getInstance().addNavigationHook(() => HeaderAction.hidde());
    }

    static checkAuth() {
        document.querySelectorAll('.user-list__menu-item').forEach((li) => li.classList.toggle('hidden'));
        assertDefined(document.querySelector('#signIcon')).classList.toggle('hidden');
        assertDefined(document.querySelector('#userIcon')).classList.toggle('hidden');
    }

    static hidde() {
        assertDefined(document.querySelector('#userMenu')).classList.add('hidden');
    }
}

export default HeaderAction;
