import { LitElement, html, css, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * 📱 Mobile-optimized checkbox component based on the Design System
 * 
 * Designed exclusively for mobile applications with touch-first interactions.
 * Perfect for forms, settings, task lists, and multi-selection on mobile devices.
 * Includes large touch targets (44x44px minimum) and clear visual states.
 * 
 * @element lit-checkbox
 * 
 * @attr {boolean} checked - Whether the checkbox is checked
 * @attr {boolean} disabled - Whether the checkbox is disabled
 * @attr {string} name - Name attribute for form submissions
 * @attr {string} value - Value attribute for form submissions
 * @attr {string} label - Optional label text for the checkbox
 * @attr {boolean} indeterminate - Whether the checkbox is in indeterminate state (not implemented yet)
 * 
 * @fires checkbox-change - Fired when the checkbox state changes (on tap/click)
 * 
 * ## Mobile Features
 * - ✅ Touch-optimized: Minimum 44x44px touch target
 * - ✅ Tap interactions: Primary interaction method
 * - ✅ Active state feedback: Visual feedback on tap
 * - ✅ Keyboard navigation: Space/Enter for accessibility (external keyboards)
 * - ✅ Screen reader support: Full ARIA checkbox semantics
 * - ✅ Reduced motion: Respects prefers-reduced-motion
 * - ✅ Multi-selection: Perfect for mobile forms and lists
 * 
 * @csspart checkbox - The checkbox container
 * @csspart input - The hidden checkbox input
 * @csspart box - The checkbox square box
 * @csspart checkmark - The checkmark icon when selected
 * @csspart label - The label text container
 * 
 * @cssprop --checkbox-size - Size of the checkbox (default: 24px)
 * @cssprop --checkbox-border-width - Border width (default: 2px)
 * @cssprop --checkbox-border-radius - Border radius (default: 4px)
 * @cssprop --checkbox-border-rest - Border color in rest state
 * @cssprop --checkbox-border-hover - Border color on hover
 * @cssprop --checkbox-bg-hover - Background color on hover
 * @cssprop --checkbox-bg-selected - Background color when selected
 * @cssprop --checkbox-checkmark-color - Color of the checkmark when selected
 * @cssprop --checkbox-border-disabled - Border color when disabled
 * @cssprop --checkbox-bg-disabled - Background color when disabled
 * @cssprop --checkbox-checkmark-disabled - Checkmark color when disabled and selected
 * 
 * @example
 * ```html
 * <!-- Basic checkbox -->
 * <lit-checkbox name="option" value="1"></lit-checkbox>
 * 
 * <!-- Checkbox with label -->
 * <lit-checkbox name="option" value="2" label="Accept terms"></lit-checkbox>
 * 
 * <!-- Checked checkbox -->
 * <lit-checkbox name="option" value="3" checked></lit-checkbox>
 * 
 * <!-- Disabled checkbox -->
 * <lit-checkbox name="option" value="4" disabled></lit-checkbox>
 * 
 * <!-- Disabled and checked -->
 * <lit-checkbox name="option" value="5" disabled checked></lit-checkbox>
 * 
 * <!-- With event listener -->
 * <lit-checkbox @checkbox-change=${(e) => console.log(e.detail.checked)}></lit-checkbox>
 * ```
 */
@customElement('lit-checkbox')
export class LitCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';

  @state() private _isHovered = false;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      /* 📱 Mobile: Minimum touch target size */
      min-height: 44px;
      min-width: 44px;
      
      /* Size configuration */
      --checkbox-size: 24px;
      --checkbox-border-width: 2px;
      --checkbox-border-radius: var(--border-radius-sm, 4px);
      
      /* Rest state */
      --checkbox-border-rest: var(--color-secondary-200, #94b4d4);
      --checkbox-bg-rest: var(--color-neutral-white, #ffffff);
      
      /* Hover state */
      --checkbox-border-hover: var(--color-primary-600, #328200);
      --checkbox-bg-hover: var(--color-secondary-40, #e6ecf3);
      
      /* Selected state */
      --checkbox-bg-selected: var(--color-primary-900, #052819);
      --checkbox-checkmark-color: var(--color-neutral-white, #ffffff);
      
      /* Disabled states */
      --checkbox-border-disabled: var(--color-neutral-200, #a9b8c6);
      --checkbox-bg-disabled: var(--color-secondary-20, #f5f7fa);
      --checkbox-checkmark-disabled: var(--color-neutral-200, #a9b8c6);
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 1;
    }

    .checkbox-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    /* Hidden checkbox input for accessibility and form integration */
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* Checkbox box container */
    .checkbox-container {
      position: relative;
      width: var(--checkbox-size);
      height: var(--checkbox-size);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Checkbox box */
    .checkbox-box {
      position: absolute;
      inset: 0;
      border-radius: var(--checkbox-border-radius);
      border: var(--checkbox-border-width) solid var(--checkbox-border-rest);
      background-color: var(--checkbox-bg-rest);
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Rest state (unchecked) */
    :host(:not([checked]):not([disabled])) .checkbox-box {
      border-color: var(--checkbox-border-rest);
      background-color: var(--checkbox-bg-rest);
    }

    /* Hover state (unchecked) */
    :host(:not([checked]):not([disabled])) .checkbox-container:hover .checkbox-box,
    :host(:not([checked]):not([disabled])[_hover]) .checkbox-box {
      border-color: var(--checkbox-border-hover);
      background-color: var(--checkbox-bg-hover);
    }

    /* Selected state */
    :host([checked]:not([disabled])) .checkbox-box {
      border-color: var(--checkbox-bg-selected);
      background-color: var(--checkbox-bg-selected);
    }

    /* Selected + Hover state */
    :host([checked]:not([disabled])) .checkbox-container:hover .checkbox-box,
    :host([checked]:not([disabled])[_hover]) .checkbox-box {
      opacity: 0.9;
    }

    /* Disabled state (unchecked) */
    :host([disabled]:not([checked])) .checkbox-box {
      border-color: var(--checkbox-border-disabled);
      background-color: var(--checkbox-bg-disabled);
    }

    /* Disabled state (checked) */
    :host([disabled][checked]) .checkbox-box {
      border-color: var(--checkbox-border-disabled);
      background-color: var(--checkbox-bg-disabled);
    }

    /* Checkmark icon */
    .checkmark {
      position: relative;
      width: 20px;
      height: 20px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s ease-in-out;
    }

    .checkmark svg {
      width: 100%;
      height: 100%;
      fill: var(--checkbox-checkmark-color);
    }

    /* Show checkmark when checked */
    :host([checked]) .checkmark {
      opacity: 1;
      transform: scale(1);
    }

    /* Disabled checkmark color */
    :host([disabled][checked]) .checkmark svg {
      fill: var(--checkbox-checkmark-disabled);
    }

    /* Label text */
    .label {
      color: var(--color-text-primary, var(--color-neutral-black, #001f3d));
      font-size: 14px;
      line-height: 1.5;
      user-select: none;
    }

    :host([disabled]) .label {
      color: var(--color-text-disabled, var(--color-neutral-300, #73808c));
    }

    /* Focus visible state (external keyboards) */
    :host(:focus-visible) .checkbox-box {
      outline: 2px solid var(--color-primary-300, #a0eb78);
      outline-offset: 2px;
    }

    /* 📱 Active state for touch feedback */
    :host(:active:not([disabled])) .checkbox-box {
      transform: scale(0.95);
    }

    /* Support for reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .checkbox-box,
      .checkmark {
        transition: none;
      }
      
      :host(:active:not([disabled])) .checkbox-box {
        transform: none;
      }
    }
  `;

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.checked = !this.checked;

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('checkbox-change', {
        detail: {
          checked: this.checked,
          value: this.value,
          name: this.name
        },
        bubbles: true,
        composed: true,
      })
    );

    // Dispatch native change event for form integration
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._handleClick(e);
    }
  }

  private _handleMouseEnter() {
    if (!this.disabled) {
      this._isHovered = true;
    }
  }

  private _handleMouseLeave() {
    this._isHovered = false;
  }

  render() {
    return html`
      <div 
        class="checkbox-wrapper"
        part="checkbox"
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        tabindex=${this.disabled ? '-1' : '0'}
        role="checkbox"
        aria-checked=${this.checked ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${this.label || this.name || 'checkbox'}
      >
        <input
          type="checkbox"
          part="input"
          .checked=${this.checked}
          .disabled=${this.disabled}
          name=${this.name}
          value=${this.value}
          tabindex="-1"
          aria-hidden="true"
        />
        
        <div class="checkbox-container" part="box">
          <div class="checkbox-box">
            <div class="checkmark" part="checkmark">
              ${svg`
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 7.5L8 16L3.5 11.5L5 10L8 13L15 6L16.5 7.5Z"/>
                </svg>
              `}
            </div>
          </div>
        </div>

        ${this.label
        ? html`<span class="label" part="label">${this.label}</span>`
        : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-checkbox': LitCheckbox;
  }
}
