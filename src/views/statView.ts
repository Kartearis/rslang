import ViewInterface from './viewInterface';
import './stat-view.css';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
import * as assert from "assert";
import {assertDefined} from "../helpers/helpers";

const template = document.createElement('template');
template.innerHTML = `
    <section class="stats">
        <h2 class="stats__header">Statistics</h2>
        <div class="stats__short-container">
            <div class="stat-card" id="gs-sprint">
                <h4 class="stat-card__header">Sprint</h4>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">New</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">Combo</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie">
                    <h5 class="stat-card__pie-title">Correct answers</h5>
                    <canvas class="stat-card__pie-canvas"></canvas>
                </div>
            </div>
            <div class="stat-card" id="gs-audio">
                <h4 class="stat-card__header">Audio</h4>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">New</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">Combo</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie">
                    <h5 class="stat-card__pie-title">Correct answers</h5>
                    <canvas class="stat-card__pie-canvas"></canvas>
                </div>
            </div>
            <div class="stat-card" id="ws">
                <h4 class="stat-card__header">Word stats</h4>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">New</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number">
                    <h5 class="stat-card__value-title">Learnt</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie">
                    <h5 class="stat-card__pie-title">Correct answers</h5>
                    <canvas class="stat-card__pie-canvas"></canvas>
                </div>
            </div>
        </div>
        <div class="stats__long-container">
            <div class="stat-graph" id="wpd">
                <h4 class="stat-graph__header">New words per day</h4>
                <canvas class="stat-graph__canvas"></canvas>
            </div>
            <div class="stat-graph" id="lw">
                <h4 class="stat-graph__header">Learned words (cumulative)</h4>
                <canvas class="stat-graph__canvas"></canvas>
            </div>
        </div>
    </section>
`;

export default class StatView extends ViewInterface {
    private gsSprintNew?: HTMLElement;
    private gsSprintCombo?: HTMLElement;
    private gsSprintPie?: HTMLCanvasElement;
    private gsAudioNew?: HTMLElement;
    private gsAudioCombo?: HTMLElement;
    private gsAudioPie?: HTMLCanvasElement;
    private wsNew?: HTMLElement;
    private wsLearnt?: HTMLElement;
    private wsPie?: HTMLCanvasElement;
    private wpdCanvas?: HTMLCanvasElement;
    private lwCanvas?: HTMLCanvasElement;

    show(): void {
        this.rootElement.append(template.content.cloneNode(true));
        this.gsSprintPie = assertDefined(this.rootElement.querySelector('#gs-sprint .stat-card__pie-canvas'));
        this.drawPieChart(this.gsSprintPie, [60, 40]);
        this.gsAudioPie = assertDefined(this.rootElement.querySelector('#gs-audio .stat-card__pie-canvas'));
        this.drawPieChart(this.gsAudioPie, [50, 50]);
        this.wsPie = assertDefined(this.rootElement.querySelector('#ws .stat-card__pie-canvas'));
        this.drawPieChart(this.wsPie, [10, 90]);
        this.wpdCanvas = assertDefined(this.rootElement.querySelector('#wpd .stat-graph__canvas'));
        this.drawLongChart(this.wpdCanvas, {label: 'Words per day', data: [
            {date: new Date('2022-07-01'), words: 2},
            {date: new Date('2022-07-02'), words: 5},
            {date: new Date('2022-07-03'), words: 0},
            {date: new Date('2022-07-04'), words: 0},
            {date: new Date('2022-07-05'), words: 10},
            {date: new Date('2022-07-06'), words: 13},
            {date: new Date('2022-07-07'), words: 0},
            {date: new Date('2022-07-08'), words: 15},
        ]});
        this.lwCanvas = assertDefined(this.rootElement.querySelector('#lw .stat-graph__canvas'));
        this.drawLongChart(this.lwCanvas, {label: 'Learned words', data: [
                {date: new Date('2022-07-01'), words: 2},
                {date: new Date('2022-07-02'), words: 5},
                {date: new Date('2022-07-03'), words: 6},
                {date: new Date('2022-07-04'), words: 6},
                {date: new Date('2022-07-05'), words: 9},
                {date: new Date('2022-07-06'), words: 13},
                {date: new Date('2022-07-07'), words: 13},
                {date: new Date('2022-07-08'), words: 15},
            ]});
    }

    drawPieChart(element: HTMLCanvasElement, data: number[]): void {
        const ctx = assertDefined(element.getContext('2d'));
        const chartData = {
            labels: [
                'Correct',
                'Incorrect'
            ],
            datasets: [{
                label: 'Correct Answers',
                data: data,
                backgroundColor: [
                    getComputedStyle(this.rootElement).getPropertyValue('--color-accent'),
                    getComputedStyle(this.rootElement).getPropertyValue('--color-accent-2'),
                ],
                hoverOffset: 4
            }]
        };
        const chart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            plugins: [ChartDataLabels],
            options: {
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        formatter: function(value, context) {
                            return assertDefined(context?.chart?.data?.labels)[context.dataIndex];
                        }
                    }
                }
            }
        });
    }

    drawLongChart(element: HTMLCanvasElement, data: {label: string, data: {date: Date, words: number}[]}): void {
        const ctx = assertDefined(element.getContext('2d'));
        const chartData = {
            labels: data.data.map((x: {date: Date, words: number}) => x.date.toLocaleDateString()),
            datasets: [{
                label: data.label,
                data: data.data.map((x: {date: Date, words: number}) => x.words),
                hoverOffset: 4,
                borderColor: getComputedStyle(this.rootElement).getPropertyValue('--color-accent'),
                fill: true
            }]
        };
        const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            // plugins: [ChartDataLabels],
            options: {
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    },
                    // datalabels: {
                    //
                    // }
                }
            }
        });
    }
}
