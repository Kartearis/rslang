import UserController from '../controllers/userController';
import userController from '../controllers/userController';
import { assertDefined } from '../helpers/helpers';

class HeaderAction {
    static addAction() {
        let burgerBtn = assertDefined(document.querySelector<HTMLButtonElement>('.burger'));
        let menu = assertDefined(document.querySelector('.menu-list'));
        let coverLayer = assertDefined(document.querySelector('.cover-layer'));
        let userBtn = assertDefined(document.querySelector('.header-auth'));

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

        document.querySelectorAll('.menu-list__menu-link').forEach(a => {
            a.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                menu.classList.remove('active');
                coverLayer.classList.remove('active');
            });
        });

        userBtn.addEventListener('click', () => {
            assertDefined(document.querySelector('#userMenu')).classList.toggle('hidden');
        })
    }

    static checkAuth() {
        document.querySelectorAll('.user-list__menu-item').forEach(li => li.classList.toggle('hidden'));
        assertDefined(document.querySelector('#signIcon')).classList.toggle('hidden');
        assertDefined(document.querySelector('#userIcon')).classList.toggle('hidden');
    }

    static hidde() {
        assertDefined(document.querySelector('.header-auth'));
    }


}

export default HeaderAction