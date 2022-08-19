class Pagination {
    page = 0;
  
    limitPage = 1;
  
    lockBtn = () => {
      const prev = document.querySelector<HTMLButtonElement>('#prevBtn');
      const next = document.querySelector<HTMLButtonElement>('#nextBtn');
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
  
    getPagination = (reDraw: () => void) => {
      const paination = document.createElement('div');
      paination.id = 'paination';
      paination.addEventListener('click', () => {
        this.lockBtn();
        const el = document.querySelector<HTMLSpanElement>('#pageNum');
        if (el !== null) {
          el.textContent = (this.page + 1).toString();
        }
        reDraw();
      });
      const prev = document.createElement('button');
      prev.innerText = 'Prev';
      prev.disabled = true;
      prev.id = 'prevBtn';
      prev.addEventListener('click', () => { this.page -= 1; });
      const next = document.createElement('button');
      next.innerText = 'Next';
      next.id = 'nextBtn';
      next.addEventListener('click', () => { this.page += 1; });
      paination.append(prev);
      const pageNum = document.createElement('span');
      pageNum.id = 'pageNum';
      pageNum.innerText = '1';
      paination.append(pageNum);
      paination.append(next);
      return paination;
    };
  }
  export default Pagination;
  