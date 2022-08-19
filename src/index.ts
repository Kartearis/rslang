import EbookView from "./assets/views/eBookView";

const eBook = new EbookView(document.querySelector<HTMLElement>('.content')!);
eBook.drawEbook();;
