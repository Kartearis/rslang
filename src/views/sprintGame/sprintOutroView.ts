import ViewInterface from "../viewInterface";
import SprintGameController from "../../controllers/sprintGameController";


export default class SprintOutroView extends ViewInterface {

    constructor(rootElement: HTMLElement, controller: SprintGameController) {
        super(rootElement);
    }

    show() {
        this.rootElement.innerHTML = "";

    }
}