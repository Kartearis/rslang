import ViewInterface from './viewInterface';
import './stat-view.css';

const template = document.createElement('template');
template.innerHTML = `
    <section class="stats">
        <h2 class="stats__header">Statistics</h2>
        <div class="stats__short-container">
            <div class="stat-card">
                <h4 class="stat-card__header">Game stats</h4>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">New</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">Combo</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie"></div>
            </div>
            <div class="stat-card">
                <h4 class="stat-card__header">Word stats</h4>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">New</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">Learnt</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie"></div>
            </div>
        </div>
        <div class="stats__long-container">
            <div class="stat-graph">
                <h4 class="stat-graph__header">Words per day</h4>
                <div class="stat-graph__canvas"></div>
            </div>
            <div class="stat-graph">
                <h4 class="stat-graph__header">Learning velocity</h4>
                <div class="stat-graph__canvas"></div>
            </div>
        </div>
    </section>
`;

export default class StatView extends ViewInterface {
    // constructor(rootElement: HTMLElement) {
    //     super(rootElement);
    // }

    show(): void {
        this.rootElement.append(template.content.cloneNode(true));
    }
}
