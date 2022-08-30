import EbookView from '../views/eBookView';

import MainView from '../views/mainView';
import TestView from '../views/test';
import ViewInterface, { ViewConstructor } from '../views/viewInterface';
import RegistrationView from '../views/registrationView';
import LogoutView from '../views/logoutView';
import SigninView from '../views/signinView';
import StatView from '../views/statView';
import SprintGameView from "../views/sprintGameView";
import AudiocallView from '../views/audiocallView';

export type RouteConfig = Record<string, ViewConstructor>;

export default class RouterController {
    private static instance: RouterController;

    private routeConfig: RouteConfig;
    private history: History;
    private rootElement: HTMLElement = document.body;
    private lastView: ViewInterface | null = null

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
            '/test': TestView,
            '/stats': StatView,
            '/ebook': EbookView,
            '/audocall': AudiocallView,
            '/signin': SigninView,
            '/registration': RegistrationView,
            '/logout': LogoutView,
            '/sprint': SprintGameView
        };
        this.history = window.history;
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

    private renderView(to: string, data: null | unknown = null): void {
        if (this.lastView)
            this.lastView.destroy();
        const view = new this.routeConfig[to](this.rootElement, data);
        this.lastView = view;
        view.show();
    }

    // Implement saving auxData to localStorage to facilitate reopen on reload
    reOpenCurrent(): void {
        const path = window.location.pathname;
        if (path in this.routeConfig) this.renderView(path);
        else this.renderView('/');
    }

    navigate(to: string, data: null | unknown = null): void {
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
