import MainView from '../views/mainView';
import TestView from '../views/test';
import { ViewConstructor } from '../views/viewInterface';
import StatView from '../views/statView';
import SprintGameView from "../views/sprintGameView";

export type RouteConfig = Record<string, ViewConstructor>;

export default class RouterController {
    private static instance: RouterController;

    private routeConfig: RouteConfig;
    private history: History;
    private rootElement: HTMLElement = document.body;

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
            '/sprint': SprintGameView
        };
        this.history = window.history;
        window.addEventListener('popstate', (event: PopStateEvent) => this.processStatePop(event));
    }

    private processStatePop(event: PopStateEvent) {
        if (event.state === null) this.reOpenCurrent();
        else this.renderView(event.state.path);
    }

    setRootElement(rootElement: HTMLElement) {
        this.rootElement = rootElement;
    }

    addRoute(path: string, view: ViewConstructor) {
        this.routeConfig[path] = view;
    }

    private renderView(to: string): void {
        const view = new this.routeConfig[to](this.rootElement);
        view.show();
    }

    reOpenCurrent(): void {
        const path = window.location.pathname;
        if (path in this.routeConfig) this.renderView(path);
        else this.renderView('/');
    }

    navigate(to: string): void {
        this.history.pushState({ path: to }, to, to);
        this.renderView(to);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }
}
