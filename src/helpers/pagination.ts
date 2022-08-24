import EBookController from '../controllers/eBookController';
import { assertDefined, GROUP_NAME, HARD_WORD_PAGE_NUM, WORDS_ON_PAGE } from './helpers';
import './pagination.css';

class Pagination {
    page: number;
    limitPage: number;
    reDraw: ()=>Promise<void>;
    eBookController: EBookController;
    constructor(reDraw: ()=>Promise<void>) {
        this.page = sessionStorage.getItem('lastPage') !== undefined ? Number(sessionStorage.getItem('lastPage')) : 0;
        this.limitPage = 30;
        this.reDraw = reDraw;
        this.eBookController = EBookController.getInstance();
    }
    lockBtn = (prev: HTMLButtonElement | null = null, next: HTMLButtonElement | null = null) => {
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
        if(group === HARD_WORD_PAGE_NUM){
            const pagination = assertDefined(document.querySelector('.pagination'));
            pagination.querySelectorAll('button').forEach(btn => btn.disabled = true);
            pagination.querySelectorAll<HTMLButtonElement>('.page-page-num').forEach((btn, i) => {
                btn.innerText = i === 2 ? '1' : '';
            })
        } else {
            this.reDrawPaginationPages();
            this.lockBtn();
        }
        
    }
    async getPagination() {
        const NUM_LAST_PAGE_BUTTON = 4;
        const pagination = document.createElement('div');
        pagination.id = 'pagination';
        pagination.classList.add('pagination');
        const pagesBlock = this.getPaginationPagesBlock();
        const prevBtn = document.createElement('button');
        prevBtn.innerText = '➙';
        prevBtn.id = 'prevBtn';
        prevBtn.classList.add('prev-page-btn');
        prevBtn.addEventListener('click', async () => {
            this.page -= 1;
            sessionStorage.setItem('lastPage', this.page.toString());
            assertDefined(document.querySelectorAll('.page-page-num')[NUM_LAST_PAGE_BUTTON]).remove();
            const curPage = assertDefined(document.querySelector('#pageNum'));
            curPage.classList.remove('current-page');
            curPage.id = '';
            const newCurPage = assertDefined(curPage.previousElementSibling);
            newCurPage.classList.add('current-page');
            newCurPage.id = 'pageNum';
            const pagesBlock = assertDefined(document.querySelector('.pagination__pages'));
            const newPageBtn = this.page > 1 ? await this.getPageButton(this.page - 1) : await this.getPageButton() ;
            pagesBlock.prepend(newPageBtn);
            this.lockBtn();
            this.reDraw();
        });
        const nextBtn = document.createElement('button');
        nextBtn.innerText = '➙';
        nextBtn.id = 'nextBtn';
        nextBtn.classList.add('next-page-btn');
        nextBtn.addEventListener('click', async (ev) => {
            const target = ev.target as HTMLButtonElement;
            this.page += 1;
            sessionStorage.setItem('lastPage', this.page.toString());
            assertDefined(document.querySelector('.page-page-num')).remove();
            const curPage = assertDefined(document.querySelector('#pageNum'));
            curPage.classList.remove('current-page');
            curPage.id = '';
            const newCurPage = assertDefined(curPage.nextElementSibling);
            newCurPage.classList.add('current-page');
            newCurPage.id = 'pageNum';
            const pagesBlock = assertDefined(document.querySelector('.pagination__pages'));
            const newPageBtn = this.page < this.limitPage - 1 ? await this.getPageButton(this.page + 3) : await this.getPageButton() ;
            pagesBlock.append(await newPageBtn);
            
            this.lockBtn();
            this.reDraw();
        });
        this.lockBtn(prevBtn, nextBtn);
        pagination.append(prevBtn);
        pagination.append(await pagesBlock);
        pagination.append(nextBtn);

        return pagination;
    };
    async getPaginationPagesBlock(): Promise<HTMLDivElement> {
        const paginationNums = document.createElement('div');
        paginationNums.classList.add('pagination__pages');
        const minPage  = this.page+1 > 2 ? await this.getPageButton(this.page - 1) : await this.getPageButton() ;
        const prevPave  = this.page+1 > 1 ? await this.getPageButton(this.page) : await this.getPageButton();
        const curPage = await this.getPageButton( this.page + 1);
        const nextPage = this.page+1 < this.limitPage ? await this.getPageButton(this.page + 2) : await this.getPageButton();
        const maxPage = this.page + 1 < this.limitPage ? await this.getPageButton(this.page + 3) : await this.getPageButton();
        paginationNums.append(minPage);
        paginationNums.append(prevPave);
        paginationNums.append(curPage);
        paginationNums.append(nextPage);
        paginationNums.append(maxPage);
        return paginationNums;
    }
    private async getPageButton( num: number | null = null ): Promise<HTMLButtonElement>{
        const numPageBtn = document.createElement('button');
        numPageBtn.classList.add('page-page-num');
        const isLearned = await this.isLearnedPage();
        console.log(isLearned);
        if(isLearned){
            console.log(num + " " +'Все изучено');
            numPageBtn.classList.add('.page-page-num_learned');
        }
        if(num === this.page + 1) {
            numPageBtn.classList.add('current-page');
            numPageBtn.id = 'pageNum';
        }
        if( num === null ){
            numPageBtn.innerText = '';
            numPageBtn.disabled = true;
        } else {
            numPageBtn.innerText = num.toString();
            numPageBtn.dataset.pageNum = num.toString() ;
        }
        numPageBtn.addEventListener('click', (ev) => {
            const target = ev.target as HTMLButtonElement;
            this.page = Number(target.dataset.pageNum) - 1;
            sessionStorage.setItem('lastPage', this.page.toString());
            this.reDrawPaginationPages();
            this.lockBtn();
            this.reDraw();
        })
        return numPageBtn;
    }

    private async reDrawPaginationPages(){
        const pageBlock = await this.getPaginationPagesBlock();
        const prevBtn = assertDefined(document.querySelector('.prev-page-btn'));
        assertDefined(document.querySelector('.pagination__pages')).remove();
        prevBtn.after(pageBlock);
    }

    private async isLearnedPage(_group: number | null = null){
        const group = _group === null ? Number(localStorage.getItem(GROUP_NAME)) : _group;
        const words = await this.eBookController.getWordsUserOnPage(group, this.page);
        const count = words?.filter(word => word.userWord !== undefined).length;
        return count === WORDS_ON_PAGE;
    }
}
export default Pagination;
