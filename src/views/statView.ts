import ViewInterface from './viewInterface';
import './stat-view.css';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
import { assertDefined } from '../helpers/helpers';
import DailyStatsController, { DailyStats } from '../controllers/dailyStatsController';
import StatsController, { DateBasedStats } from '../controllers/statsController';
import LoadingOverlay from '../components/loadingOverlay';
import UserController from '../controllers/userController';
import RouterController from '../controllers/routerController';

const template = document.createElement('template');
template.innerHTML = `
    <section class="stats">
        <h2 class="stats__header">Статистика</h2>
        <div class="stats__short-container">
            <div class="stat-card" id="gs-sprint">
                <h4 class="stat-card__header">Спринт</h4>
                <div class="stat-card__number" id="gs-s-new">
                    <h5 class="stat-card__value-title">Новые слова</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number" id="gs-s-combo">
                    <h5 class="stat-card__value-title">Макс. серия</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie">
                    <h5 class="stat-card__pie-title">Правильные ответы</h5>
                    <canvas class="stat-card__pie-canvas"></canvas>
                </div>
            </div>
            <div class="stat-card" id="gs-audio">
                <h4 class="stat-card__header">Аудиовызов</h4>
                <div class="stat-card__number" id="gs-a-new">
                    <h5 class="stat-card__value-title">Новые слова</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number" id="gs-a-combo">
                    <h5 class="stat-card__value-title">Макс. серия</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie">
                    <h5 class="stat-card__pie-title">Правильные ответы</h5>
                    <canvas class="stat-card__pie-canvas"></canvas>
                </div>
            </div>
            <div class="stat-card" id="ws">
                <h4 class="stat-card__header">В целом по словам</h4>
                <div class="stat-card__number" id="ws-new">
                    <h5 class="stat-card__value-title">Новые слова</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__number" id="ws-learnt">
                    <h5 class="stat-card__value-title">Изученные слова</h5>
                    <div class="stat-card__value">0</div>
                </div>
                <div class="stat-card__pie">
                    <h5 class="stat-card__pie-title">Правильные ответы</h5>
                    <canvas class="stat-card__pie-canvas"></canvas>
                </div>
            </div>
        </div>
        <div class="stats__long-container">
            <div class="stat-graph" id="wpd">
                <h4 class="stat-graph__header">Количество новых слов по датам</h4>
                <canvas class="stat-graph__canvas"></canvas>
            </div>
            <div class="stat-graph" id="lw">
                <h4 class="stat-graph__header">Количество изученных слов к дате</h4>
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
    private wpdContainer?: HTMLElement;
    private lwContainer?: HTMLElement;
    private lwCanvas?: HTMLCanvasElement;

    processCorrectIncorrect(stats: DailyStats): number[] {
        if (stats.correctCnt === 0 && stats.incorrectCnt === 0) return [0, 0, 0];
        return [stats.correctCnt, stats.incorrectCnt];
    }

    aggregateWordDailyStats(gameStats: DailyStats[]): DailyStats {
        return gameStats.reduce((res: DailyStats, cur: DailyStats) => {
            return DailyStatsController.addStats(res, cur);
        }, DailyStatsController.getEmpty());
    }

    show(): void {
        // If user is not authorised - redirect to signin
        // TODO: implement on base class (or some middle class)
        if (!UserController.getInstance().isSignin()) RouterController.getInstance().navigate('/signin');

        this.rootElement.innerHTML = '';

        this.rootElement.append(template.content.cloneNode(true));
        this.gsSprintPie = assertDefined(this.rootElement.querySelector('#gs-sprint .stat-card__pie-canvas'));
        this.wpdCanvas = assertDefined(this.rootElement.querySelector('#wpd .stat-graph__canvas'));
        this.lwCanvas = assertDefined(this.rootElement.querySelector('#lw .stat-graph__canvas'));
        this.wpdContainer = assertDefined(this.rootElement.querySelector('#wpd'));
        this.lwContainer = assertDefined(this.rootElement.querySelector('#lw'));
        this.fillDailyStats();
        this.fillGlobalStats();
    }

    fillDailyStats(): void {
        const sprintDailyStatsController = new DailyStatsController('sprint-game');
        const audioDailyStatsController = new DailyStatsController('audio-game');
        const sprintStats = sprintDailyStatsController.readStats();
        const audioStats = audioDailyStatsController.readStats();
        const wordStats = this.aggregateWordDailyStats([sprintStats, audioStats]);

        this.drawPieChart(assertDefined(this.gsSprintPie), this.processCorrectIncorrect(sprintStats));
        (assertDefined(
            this.rootElement.querySelector('#gs-s-combo .stat-card__value')
        ) as HTMLElement).innerText = sprintStats.longestCombo.toString();

        (assertDefined(
            this.rootElement.querySelector('#gs-s-new .stat-card__value')
        ) as HTMLElement).innerText = sprintStats.newCnt.toString();
        (assertDefined(
            this.rootElement.querySelector('#gs-a-combo .stat-card__value')
        ) as HTMLElement).innerText = audioStats.longestCombo.toString();
        (assertDefined(
            this.rootElement.querySelector('#gs-a-new .stat-card__value')
        ) as HTMLElement).innerText = audioStats.newCnt.toString();
        this.gsAudioPie = assertDefined(this.rootElement.querySelector('#gs-audio .stat-card__pie-canvas'));
        this.drawPieChart(this.gsAudioPie, this.processCorrectIncorrect(audioStats));
        (assertDefined(
            this.rootElement.querySelector('#ws-new .stat-card__value')
        ) as HTMLElement).innerText = wordStats.newCnt.toString();
        // Show learned cnt from localStorage, then update from db as data becomes available
        (assertDefined(
            this.rootElement.querySelector('#ws-learnt .stat-card__value')
        ) as HTMLElement).innerText = wordStats.learnedCnt.toString();
        // TODO: Actually should be handled by DailyStatsController, but this works as ad-hoc solution
        StatsController.getInstance()
            .getLearnedToday()
            .then((cnt) => {
                (assertDefined(
                    this.rootElement.querySelector('#ws-learnt .stat-card__value')
                ) as HTMLElement).innerText = cnt.toString();
            });
        this.wsPie = assertDefined(this.rootElement.querySelector('#ws .stat-card__pie-canvas'));
        this.drawPieChart(this.wsPie, this.processCorrectIncorrect(wordStats));
    }

    async fillGlobalStats(): Promise<void> {
        const statsController = new StatsController();
        const wpdLoading = new LoadingOverlay();
        const lpdLoading = new LoadingOverlay();
        assertDefined(this.wpdContainer).append(wpdLoading.show());
        assertDefined(this.lwContainer).append(lpdLoading.show());
        const newWordStats: DateBasedStats = await statsController.getNewWordsPerDate();
        this.drawLongChart(assertDefined(this.wpdCanvas), {
            label: 'Words per day',
            data: newWordStats,
        });
        const learnedWordStats: DateBasedStats = await statsController.getLearnedWordsPerDate();
        this.drawLongChart(assertDefined(this.lwCanvas), {
            label: 'Learned words',
            data: learnedWordStats,
        });
        wpdLoading.hide();
        lpdLoading.hide();
    }

    drawPieChart(element: HTMLCanvasElement, data: number[]): void {
        const ctx = assertDefined(element.getContext('2d'));
        const chartData = {
            labels: ['Correct', 'Incorrect', 'No data provided'],
            datasets: [
                {
                    label: 'Correct Answers',
                    data: data,
                    backgroundColor: [
                        getComputedStyle(this.rootElement).getPropertyValue('--color-accent-2'),
                        getComputedStyle(this.rootElement).getPropertyValue('--color-accent-6'),
                        getComputedStyle(this.rootElement).getPropertyValue('--color-shaded'),
                    ],
                    hoverOffset: 4,
                },
            ],
        };
        new Chart(ctx, {
            type: 'pie',
            data: chartData,
            plugins: [ChartDataLabels],
            options: {
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
                    },
                    datalabels: {
                        formatter: function (value, context) {
                            // Handle cases with 0 values
                            return value > 0 || context.dataIndex === 2
                                ? assertDefined(context?.chart?.data?.labels)[context.dataIndex]
                                : '';
                        },
                    },
                },
            },
        });
    }

    drawLongChart(element: HTMLCanvasElement, data: { label: string; data: { date: Date; words: number }[] }): void {
        const ctx = assertDefined(element.getContext('2d'));
        const chartData = {
            labels: data.data.map((x: { date: Date; words: number }) => x.date.toLocaleDateString()),
            datasets: [
                {
                    label: data.label,
                    data: data.data.map((x: { date: Date; words: number }) => x.words),
                    hoverOffset: 4,
                    borderColor: getComputedStyle(this.rootElement).getPropertyValue('--color-accent-2'),
                    fill: true,
                },
            ],
        };
        new Chart(ctx, {
            type: 'line',
            data: chartData,
            // plugins: [ChartDataLabels],
            options: {
                layout: {
                    padding: 20,
                },
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
                    },
                    datalabels: {
                        align: 'top',
                    },
                },
            },
        });
    }
}
