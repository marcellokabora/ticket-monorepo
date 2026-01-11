import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lit-icon';
import './lit-button';
import './lit-logo';

/**
 * Mobile viewport wrapper for Storybook stories
 * 
 * Provides a consistent mobile-sized container for showcasing components.
 * Use this component to wrap your stories with a mobile viewport frame.
 *
 * @element lit-mobile-viewport
 *
 * @attr {string} width - Viewport width: 'small' (375px) or 'large' (428px)
 * @attr {string} background - Background color: 'white', 'gray', or 'blue'
 * @attr {boolean} padding - Whether to apply padding inside the viewport
 * @attr {string} maxHeight - Optional max-height for testing scroll (e.g., '600px', '80vh')
 *
 * @slot - Default slot for page content
 * @slot footer - Optional slot for fixed footer at the bottom
 *
 * @example
 * ```html
 * <lit-mobile-viewport width="small" background="white" padding>
 *   <div>Page content here</div>
 * </lit-mobile-viewport>
 * ```
 */
@customElement('lit-mobile-viewport')
export class LitMobileViewport extends LitElement {
  @property({ type: String }) width: 'small' | 'large' = 'small';
  @property({ type: String }) background: 'white' | 'gray' | 'blue' = 'gray';
  @property({ type: Boolean }) padding = true;
  @property({ type: String }) maxHeight = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .viewport {
      width: 100%;
      min-width: 375px;
      box-sizing: border-box;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
      border: 8px solid var(--color-neutral-500);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 700px;
    }

    .viewport--max-height {
      max-height: var(--viewport-max-height);
    }

    /* Width variants */
    .viewport--small {
      max-width: 375px;
    }

    .viewport--large {
      max-width: 428px;
    }

    /* Background variants */
    .viewport--white {
      background: var(--color-neutral-white);
    }

    .viewport--gray {
      background: var(--color-secondary-20);
    }

    .viewport--blue {
      background: var(--color-secondary-40);
    }

    /* Padding */
    /* .viewport--padding .content {
      padding-left: var(--h-padding);
      padding-right: var(--h-padding);
    }

    .viewport--padding .footer {
      padding-left: var(--h-padding);
      padding-right: var(--h-padding);
    } */

    /* Header positioning */
    .header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--color-primary-800);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 56px;
      gap: 12px;
      color: var(--color-neutral-white);
    }

    .header-left,
    .header-right {
      flex: 0 0 auto;
    }

    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .content {
      /* padding-top: var(--gap-16);
      padding-bottom: var(--gap-16); */
      flex: 0 1 auto;
      overflow-y: auto;
      overflow-x: auto;
    }

    .footer {
      position: sticky;
      bottom: 0;
      z-index: 10;
      background: var(--color-neutral-white);
      border-top: 1px solid var(--color-neutral-200);
    }
  `;

  render() {
    const classes = [
      'viewport',
      `viewport--${this.width}`,
      `viewport--${this.background}`,
      this.padding ? 'viewport--padding' : '',
      this.maxHeight ? 'viewport--max-height' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const style = this.maxHeight ? `--viewport-max-height: ${this.maxHeight}` : '';

    return html`
      <div class="${classes}" style="${style}">
        <div class="header">
          <div class="header-left">
            <lit-button icon-only variant="secondary" size="small">
              <lit-icon icon="mdi:arrow-left"></lit-icon>
            </lit-button>
          </div>
          <div class="header-center">
            <lit-logo size="large"></lit-logo>
          </div>
          <div class="header-right">
            <lit-button variant="secondary" size="small" icon-only>
              <lit-icon name="menu"></lit-icon>
            </lit-button>
          </div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-mobile-viewport': LitMobileViewport;
  }
}
