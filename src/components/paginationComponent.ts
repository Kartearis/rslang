import EBookController from '../controllers/eBookController';
import UserController from '../controllers/userController';
import { assertDefined, HARD_WORD_GROUP_NUM, PAGE_ON_GROUP } from '../helpers/helpers';
import './pagination.css';

class PaginationComponent {
    page: number;
    limitPage: number;
    reDraw: () => Promise<void>;
    eBookController: EBookController;
    userController;
    constructor(reDraw: () => Promise<void>) {
        this.eBookController = EBookController.getInstance();
        this.userController = UserController.getInstance();
        this.page = sessionStorage.getItem('lastPage') !== undefined ? Number(sessionStorage.getItem('lastPage')) : 0;
        this.limitPage = PAGE_ON_GROUP;
        this.reDraw = () =>
            reDraw().then(() => {
                assertDefined(document.querySelector('#pagination'))
                    .querySelectorAll('button')
                    .forEach((btn) => (btn.disabled = false));
                this.lockBtn();
            });
    }
    private lockBtn = (pagination: HTMLElement | null = null) => {
        if (pagination === null) pagination = assertDefined(document.querySelector('#pagination'));
        const prev = assertDefined(pagination.querySelector<HTMLButtonElement>('#prevBtn'));
        const next = assertDefined(pagination.querySelector<HTMLButtonElement>('#nextBtn'));
        const prev5 = assertDefined(pagination.querySelector<HTMLButtonElement>('#prev5Btn'));
        const next5 = assertDefined(pagination.querySelector<HTMLButtonElement>('#next5Btn'));

        prev.disabled = this.page === 0 ? true : false;
        next.disabled = this.page === this.limitPage ? true : false;
        prev5.disabled = this.page <= 2 ? true : false;
        next5.disabled = this.page >= this.limitPage - 2 ? true : false;
    };
    async toFirstPage(group: number) {
        sessionStorage.setItem('lastPage', '0');
        this.page = 0;
        await this.reDrawPaginationPages(group);
    }
    async getPagination() {
        const pagination = document.createElement('div');
        pagination.id = 'pagination';
        pagination.classList.add('pagination');
        const pagesBlock = await this.getPaginationPagesBlock();
        const prev5Btn = document.createElement('button');
        prev5Btn.innerText = '❮❮';
        prev5Btn.id = 'prev5Btn';
        prev5Btn.classList.add('pagination__btn');
        prev5Btn.classList.add('pagination__btn_prev-5');
        prev5Btn.addEventListener('click', async () => this.toPrev5Page());
        pagination.append(prev5Btn);
        const prevBtn = document.createElement('button');
        prevBtn.innerText = '❮';
        prevBtn.id = 'prevBtn';
        prevBtn.classList.add('pagination__btn');
        prevBtn.classList.add('pagination__btn_prev');
        prevBtn.addEventListener('click', async () => await this.toPrevPage());
        const nextBtn = document.createElement('button');
        nextBtn.innerText = '❯';
        nextBtn.id = 'nextBtn';
        nextBtn.classList.add('pagination__btn');
        nextBtn.classList.add('pagination__btn_next');
        nextBtn.addEventListener('click', async () => await this.toNextPage());
        const next5Btn = document.createElement('button');
        next5Btn.classList.add('pagination__btn');
        next5Btn.classList.add('pagination__btn_next-5');
        next5Btn.innerText = '❯❯';
        next5Btn.id = 'next5Btn';
        next5Btn.addEventListener('click', async () => this.toNext5Page());
        pagination.append(prev5Btn);
        pagination.append(prevBtn);
        pagination.append(pagesBlock);
        pagination.append(nextBtn);
        pagination.append(next5Btn);
        this.lockBtn(pagination);
        return pagination;
    }
    private async toPrev5Page(): Promise<void> {
        assertDefined(document.querySelector('#pagination'))
            .querySelectorAll('button')
            .forEach((btn) => (btn.disabled = true));
        this.page = this.page < 5 ? 0 : (this.page -= 5);
        sessionStorage.setItem('lastPage', `${this.page}`);
        await this.reDrawPaginationPages();
    }
    private async toNext5Page(): Promise<void> {
        assertDefined(document.querySelector('#pagination'))
            .querySelectorAll('button')
            .forEach((btn) => (btn.disabled = true));
        this.page = this.page > PAGE_ON_GROUP - 5 ? PAGE_ON_GROUP : (this.page += 5);
        sessionStorage.setItem('lastPage', `${this.page}`);
        await this.reDrawPaginationPages();
    }
    private toNextPage(): void {
        assertDefined(document.querySelector('#pagination'))
            .querySelectorAll('button')
            .forEach((btn) => (btn.disabled = true));
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
                    if (this.eBookController.isPageLearned(this.page + 2)) {
                        btn.classList.add('pages__page-num_learned');
                    } else {
                        btn.classList.remove('pages__page-num_learned');
                    }
                } else {
                    btn.innerText = `${Number(btn.innerText) + 1}`;
                    btn.dataset.pageNum = `${Number(btn.dataset.pageNum) + 1}`;
                    const nextBtn = assertDefined(btn.nextElementSibling) as HTMLButtonElement;
                    if (nextBtn.classList.contains('pages__page-num_learned')) {
                        btn.classList.add('pages__page-num_learned');
                    } else {
                        btn.classList.remove('pages__page-num_learned');
                    }
                }
            }
        }
        this.reDraw();
    }
    private async toPrevPage(): Promise<void> {
        assertDefined(document.querySelector('#pagination'))
            .querySelectorAll('button')
            .forEach((btn) => (btn.disabled = true));
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
                    if (await this.eBookController.isPageLearned(this.page - 2)) {
                        btn.classList.add('pages__page-num_learned');
                    } else {
                        btn.classList.remove('pages__page-num_learned');
                    }
                } else {
                    btn.innerText = `${Number(btn.innerText) - 1}`;
                    btn.dataset.pageNum = `${Number(btn.dataset.pageNum) - 1}`;
                    const prevBtn = assertDefined(btn.previousElementSibling) as HTMLButtonElement;
                    if (prevBtn.classList.contains('pages__page-num_learned')) {
                        btn.classList.add('pages__page-num_learned');
                    } else {
                        btn.classList.remove('pages__page-num_learned');
                    }
                }
            }
        }
        this.reDraw();
    }
    private getPaginationPagesBlock(): HTMLDivElement {
        const paginationNums = document.createElement('div');
        paginationNums.classList.add('pagination__pages');
        paginationNums.classList.add('pages');
        let coef = -2;
        switch (true) {
            case this.page === 0:
                coef = 0;
                break;
            case this.page === 1:
                coef = -1;
                break;
            case this.page === PAGE_ON_GROUP:
                coef = -4;
                break;
            case this.page === PAGE_ON_GROUP - 1:
                coef = -3;
                break;
        }

        const minPage = this.getPageButton(this.page + coef);
        const prevPave = this.getPageButton(this.page + 1 + coef);
        const curPage = this.getPageButton(this.page + 2 + coef);
        const nextPage = this.getPageButton(this.page + 3 + coef);
        const maxPage = this.getPageButton(this.page + 4 + coef);
        paginationNums.append(minPage);
        paginationNums.append(prevPave);
        paginationNums.append(curPage);
        paginationNums.append(nextPage);
        paginationNums.append(maxPage);
        return paginationNums;
    }
    private getPageButton(num: number): HTMLButtonElement {
        const numPageBtn = document.createElement('button');
        numPageBtn.classList.add('pages__page-num');
        if (this.page === num) numPageBtn.classList.add('current-page');
        numPageBtn.innerText = `${num + 1}`;
        numPageBtn.dataset.pageNum = num.toString();
        if (this.userController.isSignin() && this.eBookController.isPageLearned(num)) {
            numPageBtn.classList.add('pages__page-num_learned');
        }
        numPageBtn.addEventListener('click', async (ev) => {
            const target = ev.target as HTMLButtonElement;
            this.page = Number(target.dataset.pageNum);
            sessionStorage.setItem('lastPage', this.page.toString());
            await this.reDrawPaginationPages();
        });
        return numPageBtn;
    }

    private async reDrawPaginationPages(group: number | null = null): Promise<void> {
        assertDefined(document.querySelector('#pagination'))
            .querySelectorAll('button')
            .forEach((btn) => (btn.disabled = true));
        await this.reDraw();
        const pageBlock = this.getPaginationPagesBlock();

        const prevBtn = assertDefined(document.querySelector('.pagination__btn_prev'));
        assertDefined(document.querySelector('.pagination__pages')).remove();
        prevBtn.after(pageBlock);
        if (group === HARD_WORD_GROUP_NUM)
            assertDefined(document.querySelector('#pagination'))
                .querySelectorAll<HTMLButtonElement>('button')
                .forEach((btn) => (btn.disabled = true));
    }
}
export default PaginationComponent;
