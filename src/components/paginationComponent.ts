import EBookController from '../controllers/eBookController';
import UserController from '../controllers/userController';
import { assertDefined, GROUP_NAME, HARD_WORD_GROUP_NUM, PAGE_ON_GROUP, WORDS_ON_PAGE } from '../helpers/helpers';
import { wordStatus } from '../helpers/types';
import './pagination.css';

class PaginationComponent {
    page: number;
    limitPage: number;
    reDraw: () => Promise<void>;
    eBookController: EBookController;
    userController;
    constructor(reDraw: () => Promise<void>) {
        this.page = sessionStorage.getItem('lastPage') !== undefined ? Number(sessionStorage.getItem('lastPage')) : 0;
        this.limitPage = 30;
        this.reDraw = () => reDraw().then(() => {
            assertDefined(document.querySelector('#pagination')).querySelectorAll('button').forEach(btn => btn.disabled = false);
            this.lockBtn();
        });;
        this.eBookController = EBookController.getInstance();
        this.userController = UserController.getInstance();
    }
    private lockBtn = (prev: HTMLButtonElement | null = null, next: HTMLButtonElement | null = null) => {
        if (prev == null && next === null) {
            prev = document.querySelector<HTMLButtonElement>('#prevBtn');
            next = document.querySelector<HTMLButtonElement>('#nextBtn');
        }

        if (prev !== null && next !== null) {
            if (this.page === 0) {
                prev.disabled = true;
            } else {
                prev.disabled = false;
            }
            if (this.page === this.limitPage) {
                next.disabled = true;
            } else {
                next.disabled = false;
            }
        }
    };
    toFirstPage(group: number) {
        sessionStorage.setItem('lastPage', '0');
        this.page = 0;
        if (group === HARD_WORD_GROUP_NUM) {
            const pagination = assertDefined(document.querySelector('.pagination'));
            pagination.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
            pagination.querySelectorAll<HTMLButtonElement>('.page-page-num').forEach((btn, i) => {
                btn.innerText = i === 2 ? '1' : '';
            });
        } else {
            this.reDrawPaginationPages();
            this.lockBtn();
        }
    }
    async getPagination() {
        const pagination = document.createElement('div');
        pagination.id = 'pagination';
        pagination.classList.add('pagination');
        const pagesBlock = this.getPaginationPagesBlock();
        const prevBtn = document.createElement('button');
        prevBtn.innerText = '➙';
        prevBtn.id = 'prevBtn';
        prevBtn.classList.add('prev-page-btn');
        prevBtn.addEventListener('click', async () => await this.toPrevPage());
        const nextBtn = document.createElement('button');
        nextBtn.innerText = '➙';
        nextBtn.id = 'nextBtn';
        nextBtn.classList.add('next-page-btn');
        nextBtn.addEventListener('click', async () => await this.toNextPage());
        this.lockBtn(prevBtn, nextBtn);
        pagination.append(prevBtn);
        pagination.append(await pagesBlock);
        pagination.append(nextBtn);
        return pagination;
    }

    private async toNextPage(): Promise<void> {
        assertDefined(document.querySelector('#pagination')).querySelectorAll('button').forEach(btn => btn.disabled = true);
        this.page += 1;
        sessionStorage.setItem('lastPage', this.page.toString());
        const curPage = assertDefined(document.querySelector('.current-page'));
        const pagesBlock = assertDefined(document.querySelector('.pagination__pages'));
        const buttons = pagesBlock.querySelectorAll<HTMLButtonElement>('button');

        if (this.page > PAGE_ON_GROUP - 2) {
            const newCurPage = assertDefined(curPage.nextElementSibling);
            curPage.classList.remove('current-page');
            newCurPage.classList.add('current-page');
        } else if (this.page <= 2) {
            const newCurPage = assertDefined(curPage.nextElementSibling);
            curPage.classList.remove('current-page');
            newCurPage.classList.add('current-page');
        } else {
            for (let i = 0; i < buttons.length; i += 1) {
                const btn = buttons[i];
                if (i === buttons.length - 1 && this.page < PAGE_ON_GROUP - 1) {

                    btn.innerText = `${this.page + 3}`;
                    btn.dataset.pageNum = `${this.page + 2}`;
                    if (await this.isLearnedPage(this.page + 2)) {
                        btn.classList.add('page-page-num_learned');
                    } else {
                        btn.classList.remove('page-page-num_learned');
                    }
                } else {
                    btn.innerText = `${Number(btn.innerText) + 1}`;
                    btn.dataset.pageNum = `${Number(btn.dataset.pageNum) + 1}`;
                    const nextBtn = assertDefined(btn.nextElementSibling) as HTMLButtonElement;
                    if (nextBtn.classList.contains('page-page-num_learned')) {
                        btn.classList.add('page-page-num_learned');
                    } else {
                        btn.classList.remove('page-page-num_learned');
                    }
                }
            }
        }
        this.reDraw();
    }
    private async toPrevPage(): Promise<void> {
        assertDefined(document.querySelector('#pagination')).querySelectorAll('button').forEach(btn => btn.disabled = true);
        this.page -= 1;
        sessionStorage.setItem('lastPage', this.page.toString());
        const curPage = assertDefined(document.querySelector('.current-page'));
        const pagesBlock = assertDefined(document.querySelector('.pagination__pages'));
        const buttons = pagesBlock.querySelectorAll<HTMLButtonElement>('button');
        if (this.page < 2) {
            const newCurPage = assertDefined(curPage.previousElementSibling);
            curPage.classList.remove('current-page');
            newCurPage.classList.add('current-page');
        } else if (this.page >= PAGE_ON_GROUP - 2) {
            const newCurPage = assertDefined(curPage.previousElementSibling);
            curPage.classList.remove('current-page');
            newCurPage.classList.add('current-page');
        } else {
            for (let i = buttons.length - 1; i >= 0; i -= 1) {
                const btn = buttons[i];
                if (i === 0 && this.page > 1) {
                    btn.innerText = `${this.page - 1}`;
                    btn.dataset.pageNum = `${this.page - 2}`;
                    if (await this.isLearnedPage(this.page - 2)) {
                        btn.classList.add('page-page-num_learned');
                    } else {
                        btn.classList.remove('page-page-num_learned');
                    }
                } else {
                    btn.innerText = `${Number(btn.innerText) - 1}`;
                    btn.dataset.pageNum = `${Number(btn.dataset.pageNum) - 1}`;
                    const prevBtn = assertDefined(btn.previousElementSibling) as HTMLButtonElement;
                    if (prevBtn.classList.contains('page-page-num_learned')) {
                        btn.classList.add('page-page-num_learned');
                    } else {
                        btn.classList.remove('page-page-num_learned');
                    }
                }
            }
        }
        this.reDraw();
    }
    private async getPaginationPagesBlock(): Promise<HTMLDivElement> {
        const paginationNums = document.createElement('div');
        paginationNums.classList.add('pagination__pages');

        let coef = -2;
        if (this.page < 2) {
            coef = 0;
        } else if (this.page > PAGE_ON_GROUP - 2) {
            coef = -4;
        }
        const minPage = await this.getPageButton(this.page + coef);
        const prevPave = await this.getPageButton(this.page + 1 + coef);
        const curPage = await this.getPageButton(this.page + 2 + coef);
        const nextPage = await this.getPageButton(this.page + 3 + coef);
        const maxPage = await this.getPageButton(this.page + 4 + coef);
        paginationNums.append(minPage);
        paginationNums.append(prevPave);
        paginationNums.append(curPage);
        paginationNums.append(nextPage);
        paginationNums.append(maxPage);
        return paginationNums;
    }
    private async getPageButton(num: number): Promise<HTMLButtonElement> {
        const numPageBtn = document.createElement('button');
        numPageBtn.classList.add('page-page-num');
        switch (true) {
            case (this.page === 1 && num === 1): numPageBtn.classList.add('current-page'); break;
            case (this.page === PAGE_ON_GROUP - 1 && num === PAGE_ON_GROUP - 1): numPageBtn.classList.add('current-page'); break;
            case (num === this.page): numPageBtn.classList.add('current-page');
        }
        numPageBtn.innerText = `${num + 1}`;
        numPageBtn.dataset.pageNum = num.toString();
        if (this.userController.isSignin() && (await this.isLearnedPage(num))) {
            numPageBtn.classList.add('page-page-num_learned');
        }
        numPageBtn.addEventListener('click', async (ev) => {
            const target = ev.target as HTMLButtonElement;
            this.page = Number(target.dataset.pageNum);
            sessionStorage.setItem('lastPage', this.page.toString());
            await this.reDrawPaginationPages();
            await this.reDraw();
        });
        return numPageBtn;
    }

    private async reDrawPaginationPages(): Promise<void> {
        const pageBlock = await this.getPaginationPagesBlock();
        const prevBtn = assertDefined(document.querySelector('.prev-page-btn'));
        assertDefined(document.querySelector('.pagination__pages')).remove();
        prevBtn.after(pageBlock);
    }

    private async isLearnedPage(page: number, _group: number | null = null): Promise<boolean> {
        const group = _group === null ? Number(localStorage.getItem(GROUP_NAME)) : _group;
        const words = await this.eBookController.getWordsUserOnPage(group, page);
        const count = words?.filter((word) => word.userWord?.difficulty === wordStatus.easy || word.userWord?.difficulty === wordStatus.hard).length;
        return count === WORDS_ON_PAGE;
    }
}
export default PaginationComponent;
