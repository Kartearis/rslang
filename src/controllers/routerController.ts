import EbookView from '../views/eBookView';

import MainView from '../views/mainView';
import ViewInterface, { ViewConstructor } from '../views/viewInterface';
import RegistrationView from '../views/authorization/registrationView';
import LogoutView from '../views/authorization/logoutView';
import SigninView from '../views/authorization/signinView';
import StatView from '../views/statView';
import SprintGameView from '../views/sprintGameView';
import AudiocallView from '../views/audiocallView';
import StorageController from './storageController';
import GroupSelectionView from '../views/groupSelectionView';

export type RouteConfig = Record<string, ViewConstructor>;
export type Hook = (to?: string) => void;

export default class RouterController {
    private static instance: RouterController;

    private routeConfig: RouteConfig;
    private history: History;
    private rootElement: HTMLElement = document.body;
    private lastView: ViewInterface | null = null;
    private storage: StorageController;
    private hooks: Hook[] = [];

    public static getInstance(): RouterController {
        if (!RouterController.instance) {
            RouterController.instance = new RouterController();
        }
        return RouterController.instance;
    }

    private constructor() {
        // Route config must have '/'
        this.routeConfig = {
            '/': MainView,
            '/stats': StatView,
            '/ebook': EbookView,
            '/audiocall': AudiocallView,
            '/signin': SigninView,
            '/registration': RegistrationView,
            '/logout': LogoutView,
            '/sprint': SprintGameView,
            '/level': GroupSelectionView,
        };
        this.history = window.history;
        this.storage = new StorageController('router-data');
        window.addEventListener('popstate', (event: PopStateEvent) => this.processStatePop(event));
    }

    private processStatePop(event: PopStateEvent) {
        if (event.state === null) this.reOpenCurrent();
        else this.renderView(event.state.path, event.state.data ?? null);
    }

    setRootElement(rootElement: HTMLElement) {
        this.rootElement = rootElement;
    }

    addRoute(path: string, view: ViewConstructor) {
        this.routeConfig[path] = view;
    }

    addNavigationHook(hook: Hook): void {
        this.hooks.push(hook);
    }

    clearNavigationHooks(): void {
        this.hooks = [];
    }

    private renderView(to: string, data: null | unknown = null): void {
        if (this.lastView) this.lastView.destroy();
        if (this.hooks.length > 0) this.hooks.forEach((hook) => hook(to));
        const view = new this.routeConfig[to](this.rootElement, data);
        this.lastView = view;
        // Maybe its more effective to do it on navigation and popstate
        if (data !== null) this.storage.write('lastData', data);
        else this.storage.remove('lastData');
        view.show();
    }

    // Implement saving auxData to localStorage to facilitate reopen on reload
    reOpenCurrent(): void {
        const path = window.location.pathname;
        if (path in this.routeConfig) {
            const data = this.storage.check('lastData') ? this.storage.read('lastData') : null;
            this.renderView(path, data);
        } else this.renderView('/');
    }

    navigate(to: string, data: null | unknown = null): void {
        // If data is function - call it and pass result further. Result is cached for history and reopen,
        // but updated on subsequent navigation
        if (typeof data === 'function') data = data();
        this.history.pushState({ path: to, data: data }, to, to);
        this.renderView(to, data);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }
}
