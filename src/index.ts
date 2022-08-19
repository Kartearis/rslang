
import Authorization from './assets/views/authorization/authorizationView';
import './global.css';

const container = document.querySelector<HTMLElement>('.content')!;
const login  = new Authorization(container);
login.drawAuthContainer();
