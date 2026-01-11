import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lit-button';
import './lit-icon';
import './lit-search-input';

/**
 * A mobile drawer component that slides up from the bottom
 * Features overlay backdrop, header with close button, search input, scrollable body, and footer
 * 
 * @element lit-drawer
 * 
 * @slot header - Header content (title, subtitle, etc.)
 * @slot search - Custom search input (replaces default search input)
 * @slot body - Main content area (scrollable)
 * @slot footer - Footer content at the bottom
 * 
 * @attr {boolean} open - Whether the drawer is open or closed
 * @attr {boolean} hide-close - Whether to hide the close button (default: false)
 * 
 * @fires drawer-close - Fired when the drawer is closed (via close button or overlay click)
 * @fires drawer-open - Fired when the drawer is opened
 * 
 * @csspart overlay - The backdrop overlay
 * @csspart container - The drawer container
 * @csspart header - The header section
 * @csspart body - The scrollable body section
 * @csspart footer - The footer section
 * 
 * @cssprop --drawer-max-width - Maximum width of the drawer (default: 428px)
 * @cssprop --drawer-max-height - Maximum height of the drawer (default: 90vh)
 * @cssprop --drawer-border-radius - Border radius for top corners (default: 32px)
 * 
 * @example
 * ```html
 * <lit-drawer open>
 *   <span slot="header">Select departure airport</span>
 *   <lit-search-input slot="search" placeholder="Search airports..."></lit-search-input>
 *   <div slot="body">
 *     <!-- Your scrollable content here -->
 *   </div>
 *   <div slot="footer">
 *     <lit-button variant="secondary">Change currency</lit-button>
 *   </div>
 * </lit-drawer>
 * ```
 */
@customElement('lit-drawer')
export class LitDrawer extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: 'hide-close' }) hideClose = false;

  static styles = css`
    :host {
      display: contents;
    }

    /* Overlay backdrop */
    .overlay {
      position: fixed;
      inset: 0;
      background: var(--overlay-backdrop);
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;
    }

    :host([open]) .overlay {
      opacity: 1;
      pointer-events: auto;
    }

    /* Drawer container */
    .drawer {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      width: 100%;
      max-height: var(--drawer-max-height, 90vh);
      display: flex;
      flex-direction: column;
      background: var(--color-secondary-20);
      border-radius: 0 var(--drawer-border-radius, 32px) 0 0;
      z-index: 1000;
      transition: transform 0.3s ease-in-out;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }

    :host([open]) .drawer {
      transform: translateX(-50%) translateY(0);
    }

    /* Desktop styles */
    @media (min-width: 768px) {
      .drawer {
        top: 50%;
        bottom: auto;
        transform: translateX(-50%) translateY(calc(-50% + 100vh));
        border-radius: var(--drawer-border-radius, 32px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        max-width: var(--drawer-max-width, 428px);
      }

      :host([open]) .drawer {
        transform: translateX(-50%) translateY(-50%);
      }
    }

    /* Header */
    .header {
      display: flex;
      flex-direction: column;
      gap: var(--v-padding-16, 16px);
      padding: var(--h-padding-20, 20px);
      background: var(--color-secondary-20);
      flex-shrink: 0;
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap, 12px);
    }

    .header-title {
      flex: 1;
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-semibold);
      font-size: 18px;
      line-height: 20px;
      color: var(--color-neutral-black);
      margin: 0;
    }

    .close-button {
      flex-shrink: 0;
      --button-border-color: transparent;
    }

    .close-button::part(button) {
      background: var(--color-secondary-40);
      width: 36px;
      height: 36px;
      min-width: 36px;
      padding: 6px;
      border-radius: 50%;
    }

    /* Search input slot */
    .search-slot {
      display: block;
    }

    .search-slot:empty {
      display: none;
    }

    /* Body - scrollable content */
    .body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background: var(--color-secondary-20);
      /* iOS momentum scrolling */
      -webkit-overflow-scrolling: touch;
    }

    /* Footer */
    .footer {
      flex-shrink: 0;
      background: var(--color-secondary-20);
      box-shadow: 0 0 15px 0 rgba(44, 92, 148, 0.2);
    }

    .footer:empty {
      display: none;
    }

    /* Focus management */
    .overlay:focus,
    .drawer:focus {
      outline: none;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .overlay,
      .drawer {
        transition: none;
      }
    }

    /* Scrollbar styling for webkit browsers */
    .body::-webkit-scrollbar {
      width: 8px;
    }

    .body::-webkit-scrollbar-track {
      background: transparent;
    }

    .body::-webkit-scrollbar-thumb {
      background: var(--color-secondary-100);
      border-radius: var(--border-radius-full);
    }

    .body::-webkit-scrollbar-thumb:hover {
      background: var(--color-secondary-200);
    }
  `;

  private handleOverlayClick() {
    // Only close if close button is not hidden
    if (!this.hideClose) {
      this.close();
    }
  }

  private handleCloseClick() {
    this.close();
  }

  private close() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('drawer-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.dispatchEvent(
          new CustomEvent('drawer-open', {
            bubbles: true,
            composed: true,
          })
        );
        // Prevent body scroll when drawer is open
        document.body.style.overflow = 'hidden';
      } else {
        // Restore body scroll when drawer is closed
        document.body.style.overflow = '';
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up body scroll lock when component is removed
    document.body.style.overflow = '';
  }

  render() {
    return html`
      <!-- Overlay backdrop -->
      <div
        class="overlay"
        part="overlay"
        @click=${this.handleOverlayClick}
        role="presentation"
      ></div>

      <!-- Drawer container -->
      <div
        class="drawer"
        part="container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <!-- Header -->
        <div class="header" part="header">
          <div class="header-row">
            <div id="drawer-title" class="header-title">
              <slot name="header">Drawer Title</slot>
            </div>
            ${!this.hideClose
        ? html`
              <lit-button
                class="close-button"
                variant="pillar-blue"
                size="small"
                icon-only
                @click=${this.handleCloseClick}
                aria-label="Close drawer"
              >
                <lit-icon icon="mdi:close"></lit-icon>
              </lit-button>
            `
        : ''}
          </div>

          <!-- <div class="search-slot">
            <slot name="search"></slot>
          </div> -->
        </div>

        <!-- Body - scrollable content -->
        <div class="body" part="body">
          <slot name="body"></slot>
        </div>

        <!-- Footer -->
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-drawer': LitDrawer;
  }
}
