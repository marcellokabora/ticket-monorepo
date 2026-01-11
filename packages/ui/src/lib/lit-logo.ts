import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

// Inline SVG for better performance and no external dependencies
const logoSvg = '<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.656 0H0.0320129L6.33602 5.792C7.29602 6.656 8.51201 7.136 9.79201 7.136H11.04L6.91201 3.2H8.73602C9.24802 3.2 9.69601 3.424 10.08 3.744L13.184 6.56C13.6 6.944 14.144 7.136 14.688 7.136H15.616C16.544 7.136 17.536 7.36 17.536 8C17.536 8.64 16.544 8.864 15.616 8.864H14.688C14.144 8.864 13.6 9.088 13.184 9.44L10.08 12.256C9.69601 12.576 9.21602 12.768 8.73602 12.768H6.91201L11.04 8.864H9.79201C8.51201 8.864 7.29602 9.344 6.33602 10.208L0.0320129 16H10.656C11.328 16 12 15.744 12.512 15.264L20 8.384C20.224 8.16 20.224 7.808 20 7.584L12.512 0.704C12 0.256 11.36 0 10.656 0Z" fill="#50B40A"/><path d="M6.33601 5.792C7.29601 6.656 8.512 7.136 9.792 7.136H11.04L6.912 3.2H8.73601C9.15201 3.2 9.53601 3.36 9.85601 3.584L5.792 0H0L6.304 5.792H6.33601Z" fill="#6ED22D"/><path d="M10.048 12.256C9.664 12.576 9.184 12.768 8.704 12.768H6.88L11.008 8.864H9.76C8.48 8.864 7.264 9.344 6.304 10.208L0 16H5.888" fill="#6ED22D"/></svg>';

/**
 * ticketapp logo component with text and icon
 * Converted from Figma design (node-id: 30:359)
 * 
 * @element lit-logo
 * @attr {string} size - Logo size: 'small' | 'medium' | 'large'
 */
@customElement('lit-logo')
export class LitLogo extends LitElement {
  static properties = {
    size: { type: String }
  };

  size: 'small' | 'medium' | 'large' = 'medium';

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 6px;
      position: relative;
      z-index: 10;
    }

    .logo-text {
      font-family: 'Lato', sans-serif;
      font-weight: 400;
      line-height: 1;
      color: inherit;
      flex-shrink: 0;
    }

    .logo-icon {
      position: relative;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .logo-icon svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* Size variants */
    :host([size="small"]) .logo-text {
      font-size: 14px;
    }

    :host([size="small"]) .logo-icon {
      height: 12px;
      width: 15.126px;
    }

    :host([size="medium"]) .logo-text {
      font-size: 16px;
    }

    :host([size="medium"]) .logo-icon {
      height: 16px;
      width: 20.168px;
    }

    :host([size="large"]) .logo-text {
      font-size: 23px;
    }

    :host([size="large"]) .logo-icon {
      height: 20px;
      width: 25.21px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('size', this.size);
  }

  render() {
    return html`
      <div class="logo-text" data-name="Text" data-node-id="30:416">
        ticketapp
      </div>
      <div class="logo-icon" data-name="Icon" data-node-id="30:353">
        ${unsafeSVG(logoSvg)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-logo': LitLogo;
  }
}
