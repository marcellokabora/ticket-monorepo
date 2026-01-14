import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

// Inline SVG for better performance and no external dependencies
const logoSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#50B40A"/><path d="M10 3.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V9l8 5v2l-8-2.5V19l2 1.5V22l-3.5-1-3.5 1v-1.5L10 19v-5.5l-8 2.5v-2l8-5V3.5z" fill="#6ED22D" opacity="0.6"/></svg>';

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
        Flight Ticket
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
