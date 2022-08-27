import ViewInterface from "./viewInterface";
import SprintGameController from "../controllers/sprintGameController";


export default class SprintGameView extends ViewInterface {
    private controller: SprintGameController | null = null

    show() {
        this.controller = new SprintGameController(this.rootElement);
        this.controller.showIntro();
    }
}