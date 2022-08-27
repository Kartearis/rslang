import RouterController from '../controllers/routerController';
import UserController from '../controllers/userController';
import ViewInterface from './viewInterface';

class LogoutView extends ViewInterface {
    controller: UserController;
    constructor(rootElement: HTMLElement) {
        super(rootElement);
        this.controller = UserController.getInstance();
    }

    show(): void {
        this.controller.logout();
        RouterController.getInstance().navigate('/');
        // RouterController.getInstance().reOpenCurrent();
    }
}

export default LogoutView;
