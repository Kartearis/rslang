import { assertDefined } from './helpers';
import './pagination.css';

class Pagination {
    page: number;
    limitPage: number;
    constructor() {
        this.page = sessionStorage.getItem('lastPage') !== undefined ? Number(sessionStorage.getItem('lastPage')) : 0;
        this.limitPage = 30;
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
    toFirstPage() {
        sessionStorage.setItem('lastPage', '0');
        this.page = 0;
        const el = document.querySelector<HTMLSpanElement>('#pageNum');
        if (el !== null) {
            el.textContent = (this.page + 1).toString();
        }
    }
    getPagination = (reDraw: () => void) => {
        const pagination = document.createElement('div');
        pagination.id = 'paination';
        pagination.classList.add('pagination');
        pagination.addEventListener('click', () => {
            sessionStorage.setItem('lastPage', this.page.toString());
            this.lockBtn();
            const el = assertDefined(document.querySelector<HTMLSpanElement>('#pageNum'));
            if (el !== null) {
                el.textContent = (this.page + 1).toString();
            }
            reDraw();
        });
        const prev = document.createElement('button');
        prev.innerText = '➙';
        prev.id = 'prevBtn';
        prev.classList.add('prev-page-btn');
        prev.addEventListener('click', () => {
            this.page -= 1;
        });
        const next = document.createElement('button');
        next.innerText = '➙';
        next.id = 'nextBtn';
        next.classList.add('next-page-btn');
        next.addEventListener('click', () => {
            this.page += 1;
        });
        this.lockBtn(prev, next);
        pagination.append(prev);
        const pageNum = document.createElement('span');
        pageNum.id = 'pageNum';
        pageNum.innerText = (this.page + 1).toString();
        const numPageBlock = assertDefined(document.createElement('div'));
        numPageBlock.classList.add('page-page-num');
        numPageBlock.append(pageNum);
        pagination.append(numPageBlock);
        pagination.append(next);

        return pagination;
    };
}
export default Pagination;
