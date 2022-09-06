import StorageController from './storageController';
import { formatDate, typedEntries } from '../helpers/helpers';
import UserController from './userController';

export type DailyStats = {
    correctCnt: number;
    incorrectCnt: number;
    learnedCnt: number;
    newCnt: number;
    longestCombo: number;
};

export default class DailyStatsController {
    storage: StorageController;

    constructor(prefix: string) {
        const user: UserController = UserController.getInstance();
        if (user.isSignin()) prefix = `${prefix}@${user.userId}`;
        this.storage = new StorageController(prefix);
    }

    private handleDate(): DailyStats {
        const lastUpdate: null | string = this.storage.read('lastUpdate') as null | string;
        if (lastUpdate === null || lastUpdate !== formatDate(new Date())) {
            this.storage.write('lastUpdate', formatDate(new Date()));
            this.writeEmpty();
        }
        return this.storage.read('stats') as DailyStats;
    }

    private writeEmpty(): void {
        this.storage.write('stats', DailyStatsController.getEmpty());
    }

    static getEmpty(): DailyStats {
        return {
            correctCnt: 0,
            incorrectCnt: 0,
            learnedCnt: 0,
            newCnt: 0,
            longestCombo: 0,
        };
    }

    readStats(): DailyStats {
        return this.handleDate();
    }

    updateStats(change: DailyStats): DailyStats {
        const stats: DailyStats = this.handleDate();
        DailyStatsController.addStats(stats, change);
        this.storage.write('stats', stats);
        return stats;
    }

    static addStats(base: DailyStats, change: DailyStats): DailyStats {
        typedEntries(change).forEach(([key, value]) => {
            if (key !== 'longestCombo') base[key] += value;
            else base[key] = value > base[key] ? value : base[key];
        });
        return base;
    }
}
