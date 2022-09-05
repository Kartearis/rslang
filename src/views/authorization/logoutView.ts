import HeaderAction from '../../components/headerAction';
import RouterController from '../../controllers/routerController';
import UserController from '../../controllers/userController';
import ViewInterface from '../viewInterface';

class LogoutView extends ViewInterface {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = UserController.getInstance();
    }

    show(): void {
        HeaderAction.checkAuth();
        this.controller.logout();
        RouterController.getInstance().navigate('/');
    }
}

export default LogoutView;
