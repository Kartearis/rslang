import EBookController from './eBookController';
import UserController from './userController';
import { assertDefined, GROUP_NAME, HARD_WORD_PAGE_NUM, WORDS_ON_PAGE } from '../helpers/helpers';
import './pagination.css';

class Pagination {
    page: number;
    limitPage: number;
    reDraw: () => Promise<void>;
    eBookController: EBookController;
    userController;
    constructor(reDraw: () => Promise<void>) {
        this.page = sessionStorage.getItem('lastPage') !== undefined ? Number(sessionStorage.getItem('lastPage')) : 0;
        this.limitPage = 30;
        this.reDraw = reDraw;
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
        if (group === HARD_WORD_PAGE_NUM) {
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
        this.page += 1;
        sessionStorage.setItem('lastPage', this.page.toString());
        const curPage = assertDefined(document.querySelector('#pageNum'));
        curPage.id = '';
        const newCurPage = assertDefined(curPage.nextElementSibling);
        newCurPage.id = 'pageNum';
        const pagesBlock = assertDefined(document.querySelector('.pagination__pages'));
        const newPageBtn =
            this.page < this.limitPage - 1 ? await this.getPageButton(this.page + 3) : await this.getPageButton();
        assertDefined(document.querySelector('.page-page-num')).remove();
        curPage.classList.remove('current-page');
        newCurPage.classList.add('current-page');
        pagesBlock.append(await newPageBtn);
        this.lockBtn();
        this.reDraw();
    }
    private async toPrevPage(): Promise<void> {
        const NUM_LAST_PAGE_BUTTON = 4;
        this.page -= 1;
        sessionStorage.setItem('lastPage', this.page.toString());

        const curPage = assertDefined(document.querySelector('#pageNum'));

        curPage.id = '';
        const newCurPage = assertDefined(curPage.previousElementSibling);

        newCurPage.id = 'pageNum';
        const pagesBlock = assertDefined(document.querySelector('.pagination__pages'));
        const newPageBtn = this.page > 1 ? await this.getPageButton(this.page - 1) : await this.getPageButton();
        assertDefined(document.querySelectorAll('.page-page-num')[NUM_LAST_PAGE_BUTTON]).remove();
        curPage.classList.remove('current-page');
        newCurPage.classList.add('current-page');
        pagesBlock.prepend(newPageBtn);
        this.lockBtn();
        this.reDraw();
    }
    private async getPaginationPagesBlock(): Promise<HTMLDivElement> {
        const paginationNums = document.createElement('div');
        paginationNums.classList.add('pagination__pages');
        const minPage = this.page + 1 > 2 ? await this.getPageButton(this.page - 1) : await this.getPageButton();
        const prevPave = this.page + 1 > 1 ? await this.getPageButton(this.page) : await this.getPageButton();
        const curPage = await this.getPageButton(this.page + 1);
        const nextPage =
            this.page + 1 < this.limitPage ? await this.getPageButton(this.page + 2) : await this.getPageButton();
        const maxPage =
            this.page + 1 < this.limitPage ? await this.getPageButton(this.page + 3) : await this.getPageButton();
        paginationNums.append(minPage);
        paginationNums.append(prevPave);
        paginationNums.append(curPage);
        paginationNums.append(nextPage);
        paginationNums.append(maxPage);
        return paginationNums;
    }
    private async getPageButton(num: number | null = null): Promise<HTMLButtonElement> {
        const numPageBtn = document.createElement('button');
        numPageBtn.classList.add('page-page-num');

        if (num === this.page + 1) {
            numPageBtn.classList.add('current-page');
            numPageBtn.id = 'pageNum';
        }
        if (num === null) {
            numPageBtn.innerText = '';
            numPageBtn.disabled = true;
        } else {
            numPageBtn.innerText = num.toString();
            numPageBtn.dataset.pageNum = num.toString();
            if (this.userController.isSignin() && await this.isLearnedPage(num - 1)) {
                numPageBtn.classList.add('page-page-num_learned');
            }
        }
        numPageBtn.addEventListener('click', (ev) => {
            const target = ev.target as HTMLButtonElement;
            this.page = Number(target.dataset.pageNum) - 1;
            sessionStorage.setItem('lastPage', this.page.toString());
            this.reDrawPaginationPages();
            this.lockBtn();
            this.reDraw();
            
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
        const count = words?.filter((word) => word.userWord !== undefined).length;
        return count === WORDS_ON_PAGE;
    }
}
export default Pagination;
