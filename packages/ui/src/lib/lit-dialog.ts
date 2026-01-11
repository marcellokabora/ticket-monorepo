import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lit-button';
import './lit-icon';

/**
 * A mobile dialog component that displays centered on an overlay backdrop
 * 
 * @element lit-dialog
 * 
 * @slot - Default slot for dialog content
 * 
 * @attr {boolean} open - Whether the dialog is open or closed
 * @attr {boolean} hide-close - Whether to hide the close button (default: false)
 * 
 * @fires dialog-close - Fired when the dialog is closed (via close button or overlay click)
 * @fires dialog-open - Fired when the dialog is opened
 * 
 * @csspart overlay - The backdrop overlay
 * @csspart container - The dialog container
 * @csspart content - The content wrapper
 * 
 * @cssprop --dialog-width - Width of the dialog (default: 380px)
 * @cssprop --dialog-max-width - Maximum width of the dialog (default: 90vw)
 * @cssprop --dialog-border-radius - Border radius for dialog corners (default: 16px)
 * 
 * @example
 * ```html
 * <lit-dialog open>
 *   <div class="flex flex-col gap-6 p-6">
 *     <div class="flex flex-col gap-2">
 *       <h2 class="text-xl font-bold">Dialog Title</h2>
 *       <p>Dialog content goes here.</p>
 *     </div>
 *     <div class="flex gap-3">
 *       <lit-button variant="secondary">Cancel</lit-button>
 *       <lit-button variant="primary">Confirm</lit-button>
 *     </div>
 *   </div>
 * </lit-dialog>
 * ```
 */
@customElement('lit-dialog')
export class LitDialog extends LitElement {
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
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--h-padding-20);
    }

    :host([open]) .overlay {
      opacity: 1;
      pointer-events: auto;
    }

    /* Dialog container */
    .dialog {
      position: relative;
      width: var(--dialog-width, 380px);
      max-width: var(--dialog-max-width, 90vw);
      background: var(--color-secondary-20);
      border-radius: var(--dialog-border-radius, var(--border-radius-lg));
      transform: scale(0.9);
      opacity: 0;
      transition: all 0.3s ease-in-out;
      box-shadow: var(--shadow-xl);
      max-height: 90vh;
      overflow-y: auto;
      /* iOS momentum scrolling */
      -webkit-overflow-scrolling: touch;
    }

    :host([open]) .dialog {
      transform: scale(1);
      opacity: 1;
    }

    /* Close button */
    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1;
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

    /* Content wrapper */
    .content {
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-normal);
      font-size: 14px;
      line-height: 24px;
      color: var(--color-neutral-black);
    }

    /* Focus management */
    .overlay:focus,
    .dialog:focus {
      outline: none;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .overlay,
      .dialog {
        transition: none;
      }
    }

    /* Scrollbar styling for webkit browsers */
    .dialog::-webkit-scrollbar {
      width: 8px;
    }

    .dialog::-webkit-scrollbar-track {
      background: transparent;
    }

    .dialog::-webkit-scrollbar-thumb {
      background: var(--color-secondary-100);
      border-radius: var(--border-radius-full);
    }

    .dialog::-webkit-scrollbar-thumb:hover {
      background: var(--color-secondary-200);
    }
  `;

  private handleOverlayClick(e: MouseEvent) {
    // Only close if clicking directly on overlay (not on dialog) and close button is not hidden
    if (e.target === e.currentTarget && !this.hideClose) {
      this.close();
    }
  }

  private handleCloseClick() {
    this.close();
  }

  private close() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('dialog-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.dispatchEvent(
          new CustomEvent('dialog-open', {
            bubbles: true,
            composed: true,
          })
        );
        // Prevent body scroll when dialog is open
        document.body.style.overflow = 'hidden';
      } else {
        // Restore body scroll when dialog is closed
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
      >
        <!-- Dialog container -->
        <div
          class="dialog"
          part="container"
          role="dialog"
          aria-modal="true"
          @click=${(e: Event) => e.stopPropagation()}
        >
          ${!this.hideClose
        ? html`
                <lit-button
                  class="close-button"
                  variant="pillar-blue"
                  size="small"
                  icon-only
                  @click=${this.handleCloseClick}
                  aria-label="Close dialog"
                >
                  <lit-icon icon="mdi:close"></lit-icon>
                </lit-button>
              `
        : ''}

          <!-- Content -->
          <div class="content" part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-dialog': LitDialog;
  }
}
