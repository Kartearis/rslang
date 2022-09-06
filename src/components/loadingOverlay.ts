import './loading-overlay.css';

const template = document.createElement('template');
template.innerHTML = `
    <div class="loading-overlay__spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
`;

// Creates loading overlay on closest relative element (default) or window (with fullscreen=true)
// Overlay is hidden by default
// Some elements may render on top overlay (due to stacking context). In this case append it to body.
export default class LoadingOverlay extends HTMLElement {
    constructor(fullscreen = false) {
        super();
        this.classList.add('loading-overlay', 'loading-overlay--hidden');
        if (fullscreen) this.classList.add('loading-overlay--fullscreen');
        this.append(template.content.cloneNode(true));
    }

    show() {
        this.classList.remove('loading-overlay--hidden');
        return this;
    }

    hide() {
        this.classList.add('loading-overlay--hidden');
        return this;
    }
}

customElements.define('loading-overlay', LoadingOverlay);
