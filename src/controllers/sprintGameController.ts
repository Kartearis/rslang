import ComboCounter from "../components/comboCounter";
import Timer from "../components/timer";
import ViewInterface from "../views/viewInterface";
import SprintIntroView from "../views/sprintGame/sprintIntroView";
import SprintMainView from "../views/sprintGame/sprintMainView";
import SprintOutroView from "../views/sprintGame/sprintOutroView";
import RouterController from "./routerController";


export default class SprintGameController {
    private words: string[] = []
    private history: string[] = []
    private comboCounter: ComboCounter
    private timer: Timer
    private view: ViewInterface | null = null
    private rootElement: HTMLElement
    private router: RouterController

    constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
        this.timer = new Timer(60);
        this.comboCounter = new ComboCounter();
        this.router = RouterController.getInstance();
    }

    showIntro(): void {
        this.view = new SprintIntroView(this.rootElement, this);
        this.view.show();
    }

    startGame(): void {
        this.view = new SprintMainView(this.rootElement, this.timer, this);
        this.view.show();
    }

    showResults(): void {
        this.view = new SprintOutroView(this.rootElement, this);
        this.view.show();
    }

    exit(): void {
        this.router.back();
    }

    getNextWord(): void {

    }
}

