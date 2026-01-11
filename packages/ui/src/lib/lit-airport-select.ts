import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lit-icon';

/**
 * 📱 Mobile-optimized airport selection component based on the Design System
 * 
 * An interactive field for selecting departure/arrival airports in mobile travel apps.
 * Displays airport name, code, and optional promotional discounts.
 * Supports both placeholder (rest) and selected states with hover effects.
 * 
 * @element lit-airport-select
 * 
 * @attr {string} label - Label text (e.g., "Departure", "Arrival")
 * @attr {string} airlineInfo - Optional airline info to display in primary color after label (e.g., "LH Lufthansa")
 * @attr {string} placeholder - Placeholder instruction text shown in rest state
 * @attr {string} selectedItem - Selected airport name (e.g., "London - Heathrow")
 * @attr {string} itemCode - Airport code (e.g., "LHR")
 * @attr {boolean} showDiscount - Whether to show promotional discount banner
 * @attr {string} discountText - Discount promotional text
 * @attr {boolean} disabled - Whether the field is disabled
 * 
 * @fires airport-click - Fired when the field is clicked/tapped
 * 
 * ## Mobile Features
 * - ✅ Touch-optimized: 52px height for easy tapping
 * - ✅ Tap feedback: Visual hover/active states
 * - ✅ Clear hierarchy: Label, airport name, and code
 * - ✅ Promotional support: Optional discount banner
 * - ✅ Accessible: Full ARIA support and keyboard navigation
 * 
 * @csspart container - The main container element
 * @csspart field - The airport selection field
 * @csspart content - The field content wrapper
 * @csspart label - The label element (Departure/Arrival)
 * @csspart placeholder - The placeholder instruction text
 * @csspart selected-content - The selected airport content
 * @csspart airport-name - The selected airport name
 * @csspart airport-code - The airport code
 * @csspart chevron - The chevron icon
 * @csspart discount-banner - The discount promotional banner
 * 
 * @example
 * ```html
 * <!-- Rest state with placeholder -->
 * <lit-airport-select 
 *   label="Departure"
 *   placeholder="Select departure airport">
 * </lit-airport-select>
 * 
 * <!-- Selected state with airport -->
 * <lit-airport-select 
 *   label="Departure"
 *   selectedItem="London - Heathrow"
 *   itemCode="LHR">
 * </lit-airport-select>
 * 
 * <!-- With discount banner -->
 * <lit-airport-select 
 *   label="Departure"
 *   placeholder="Select departure airport"
 *   showDiscount
 *   discountText="Enjoy 20% off online purchase!">
 * </lit-airport-select>
 * ```
 */
@customElement('lit-airport-select')
export class LitAirportSelect extends LitElement {
  @property({ type: String }) label = 'Departure';
  @property({ type: String }) airlineInfo = '';
  @property({ type: String }) placeholder = 'Select departure airport';
  @property({ type: String }) selectedItem = '';
  @property({ type: String }) itemCode = '';
  @property({ type: Boolean }) showDiscount = false;
  @property({ type: String }) discountText = 'Enjoy 20% off online purchase!';
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    /* Container for field + discount banner */
    .container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Main field element */
    .field {
      display: flex;
      box-sizing: border-box;
      height: 52px;
      background: var(--color-neutral-white);
      border: 1px solid var(--color-secondary-200);
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.15s ease-in-out;
      width: 100%;
    }

    .field:hover:not(.disabled) {
      border-color: var(--color-primary-500);
    }

    .field.selected {
      border-color: var(--color-secondary-200);
    }

    .field.selected:hover:not(.disabled) {
      border-color: var(--color-primary-500);
    }

    .field.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .field:active:not(.disabled) {
      transform: scale(0.98);
      transition: transform 0.1s ease-in-out;
    }

    /* Field content wrapper */
    .field-content {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 14px 12px 14px 16px;
      box-sizing: border-box;
      pointer-events: none;
    }

    .field-content.rest {
      gap: 10px;
    }

    .field-content.selected {
      gap: 2px;
    }

    /* Placeholder text (placeholder state) */
    .placeholder {
      flex: 1;
      font-size: 18px;
      font-weight: 400;
      color: var(--color-neutral-black);
      line-height: normal;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Selected content wrapper */
    .selected-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      overflow: hidden;
    }

    /* Label text (Departure/Arrival) */
    .label {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-neutral-300);
      line-height: normal;
      margin: 0;
    }

    .label-with-airline {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      line-height: normal;
      margin: 0;
    }

    .label-text {
      color: var(--color-neutral-300);
    }

    .airline-info {
      color: var(--color-primary-500);
    }

    /* Selected airport info row */
    .airport-info {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      min-width: 0;
    }

    /* Airport name */
    .airport-name {
      flex: 1;
      font-size: 18px;
      font-weight: 600;
      color: var(--color-grey-black);
      line-height: 20px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    /* Airport code */
    .airport-code {
      font-size: 18px;
      font-weight: 400;
      color: var(--color-secondary-300);
      line-height: normal;
      margin: 0;
      flex-shrink: 0;
    }

    /* Chevron icon */
    .chevron {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      color: var(--color-primary-600);
    }

    .chevron lit-icon {
      --icon-size: 24px;
      transform: rotate(180deg);
    }

    /* Discount banner */
    .discount-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      background: var(--color-primary-500);
      border-radius: 8px;
      padding: 4px 4px;
      box-sizing: border-box;
    }

    .discount-text {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-neutral-white);
      line-height: 20px;
      margin: 0;
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .field,
      .field:active {
        transition: none;
      }
    }
  `;

  private _handleClick() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('airport-click', {
        bubbles: true,
        composed: true,
        detail: {
          label: this.label,
          selectedItem: this.selectedItem,
          itemCode: this.itemCode,
        },
      })
    );
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  render() {
    const isSelected = this.selectedItem.trim() !== '';
    const fieldClass = `field ${isSelected ? 'selected' : ''} ${this.disabled ? 'disabled' : ''}`;
    const contentClass = `field-content ${isSelected ? 'selected' : 'rest'}`;

    return html`
      <div class="container" part="container">
        <div 
          class="${fieldClass}"
          part="field"
          role="button"
          tabindex="${this.disabled ? -1 : 0}"
          aria-label="${isSelected ? `${this.label}: ${this.selectedItem}` : this.placeholder}"
          aria-disabled="${this.disabled}"
          @click=${this._handleClick}
          @keydown=${this._handleKeyDown}
        >
          <div class="${contentClass}" part="content">
            ${isSelected ? html`
              <div class="selected-content" part="selected-content">
                ${this.airlineInfo ? html`
                  <div class="label-with-airline" part="label">
                    <span class="label-text">${this.label} with</span>
                    <span class="airline-info">${this.airlineInfo}</span>
                  </div>
                ` : html`
                  <p class="label" part="label">${this.label}</p>
                `}
                <div class="airport-info">
                  <p class="airport-name" part="airport-name">${this.selectedItem}</p>
                  <p class="airport-code" part="airport-code">${this.itemCode}</p>
                </div>
              </div>
            ` : html`
              <p class="placeholder" part="placeholder">${this.placeholder}</p>
              <div class="chevron" part="chevron">
                <lit-icon icon="mdi:chevron-left"></lit-icon>
              </div>
            `}
          </div>
        </div>

        ${this.showDiscount ? html`
          <div class="discount-banner" part="discount-banner">
            <p class="discount-text">${this.discountText}</p>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-airport-select': LitAirportSelect;
  }
}
