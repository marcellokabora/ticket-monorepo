import { LitElement, html, css } from 'lit';
import { customElement, property} from 'lit/decorators.js';

/**
 * 📱 Mobile-optimized radio button component based on the Design System
 * 
 * Designed exclusively for mobile applications with touch-first interactions.
 * Includes large touch targets (44x44px minimum) and optimized spacing for mobile devices.
 * 
 * @element lit-radio
 * 
 * @attr {boolean} checked - Whether the radio is checked/selected
 * @attr {boolean} disabled - Whether the radio is disabled
 * @attr {string} name - Name attribute for form submissions (groups radios together)
 * @attr {string} value - Value attribute for form submissions
 * @attr {string} label - Optional label text for the radio button
 * 
 * @fires radio-change - Fired when the radio state changes (on tap/click)
 * 
 * @csspart radio - The radio container
 * @csspart input - The hidden radio input
 * @csspart circle - The outer circle
 * @csspart dot - The inner selected dot
 * @csspart label - The label text container
 * 
 * @cssprop --radio-size - Size of the radio button (default: 24px, touch target is larger)
 * @cssprop --radio-border-width - Border width (default: 2px)
 * @cssprop --radio-dot-size - Size of the inner dot when selected (default: 10px)
 * @cssprop --radio-border-rest - Border color in rest state
 * @cssprop --radio-border-hover - Border color on hover (progressive enhancement)
 * @cssprop --radio-bg-hover - Background color on hover (progressive enhancement)
 * @cssprop --radio-border-selected - Border/background color when selected
 * @cssprop --radio-dot-color - Color of the inner dot when selected
 * @cssprop --radio-border-disabled - Border color when disabled
 * @cssprop --radio-bg-disabled - Background color when disabled
 * @cssprop --radio-dot-disabled - Dot color when disabled and selected
 * 
 * ## Mobile Features
 * - ✅ Touch-optimized: Minimum 44x44px touch target
 * - ✅ Tap interactions: Primary interaction method
 * - ✅ Active state feedback: Visual feedback on tap
 * - ✅ Keyboard navigation: Arrow keys for accessibility (external keyboards)
 * - ✅ Screen reader support: Full ARIA attributes
 * - ✅ Reduced motion: Respects prefers-reduced-motion
 * - ✅ Mobile-optimized spacing: Appropriate gaps for touch interfaces
 * 
 * @example
 * ```html
 * <!-- Basic radio -->
 * <lit-radio name="option" value="1"></lit-radio>
 * 
 * <!-- Radio with label -->
 * <lit-radio name="option" value="2" label="Option 2"></lit-radio>
 * 
 * <!-- Checked radio -->
 * <lit-radio name="option" value="3" checked></lit-radio>
 * 
 * <!-- Disabled radio -->
 * <lit-radio name="option" value="4" disabled></lit-radio>
 * 
 * <!-- Radio group -->
 * <lit-radio name="size" value="small" label="Small"></lit-radio>
 * <lit-radio name="size" value="medium" label="Medium" checked></lit-radio>
 * <lit-radio name="size" value="large" label="Large"></lit-radio>
 * 
 * <!-- With event listener -->
 * <lit-radio @radio-change=${(e) => console.log(e.detail.value)}></lit-radio>
 * ```
 */
@customElement('lit-radio')
export class LitRadio extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';

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
      --radio-size: 24px;
      --radio-border-width: 2px;
      --radio-dot-size: 10px;
      
      /* Rest state */
      --radio-border-rest: var(--color-secondary-200);
      --radio-bg-rest: var(--color-neutral-white);
      
      /* Hover state */
      --radio-border-hover: var(--color-primary-600);
      --radio-bg-hover: var(--color-secondary-40);
      
      /* Selected state */
      --radio-border-selected: var(--color-primary-900);
      --radio-bg-selected: var(--color-primary-900);
      --radio-dot-color: var(--color-neutral-white);
      
      /* Disabled states */
      --radio-border-disabled: var(--color-neutral-200);
      --radio-bg-disabled: var(--color-secondary-20);
      --radio-dot-disabled: var(--color-neutral-200);
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 1;
    }

    .radio-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    /* Hidden radio input for accessibility and form integration */
    input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* Radio circle container */
    .radio-container {
      position: relative;
      width: var(--radio-size);
      height: var(--radio-size);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Outer circle */
    .radio-circle {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: var(--radio-border-width) solid var(--radio-border-rest);
      background-color: var(--radio-bg-rest);
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
    }

    /* Rest state (unchecked) */
    :host(:not([checked]):not([disabled])) .radio-circle {
      border-color: var(--radio-border-rest);
      background-color: var(--radio-bg-rest);
    }

    /* Hover state (unchecked) */
    :host(:not([checked]):not([disabled])) .radio-container:hover .radio-circle,
    :host(:not([checked]):not([disabled])[data-hover]) .radio-circle {
      border-color: var(--radio-border-hover);
      background-color: var(--radio-bg-hover);
    }

    /* Selected state (checked) */
    :host([checked]:not([disabled])) .radio-circle {
      border-color: var(--radio-border-selected);
      background-color: var(--radio-bg-selected);
    }

    /* Disabled state (unchecked) */
    :host([disabled]:not([checked])) .radio-circle {
      border-color: var(--radio-border-disabled);
      background-color: var(--radio-bg-disabled);
    }

    /* Disabled + Selected state */
    :host([disabled][checked]) .radio-circle {
      border-color: var(--radio-border-disabled);
      background-color: var(--radio-bg-disabled);
    }

    /* Inner dot (only visible when checked) */
    .radio-dot {
      position: relative;
      width: var(--radio-dot-size);
      height: var(--radio-dot-size);
      border-radius: 50%;
      background-color: var(--radio-dot-color);
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease-in-out;
      z-index: 1;
    }

    /* Show dot when checked */
    :host([checked]) .radio-dot {
      opacity: 1;
      transform: scale(1);
    }

    /* Disabled dot color */
    :host([disabled][checked]) .radio-dot {
      background-color: var(--radio-dot-disabled);
    }

    /* Label styling */
    .radio-label {
      font-family: 'Lato', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.4;
      color: var(--color-neutral-black, #001f3d);
      user-select: none;
    }

    :host([disabled]) .radio-label {
      color: var(--color-neutral-300, #73808c);
    }

    /* Focus state for accessibility (external keyboards) */
    input[type="radio"]:focus-visible ~ .radio-container .radio-circle {
      outline: 2px solid var(--color-primary-300, #a0eb78);
      outline-offset: 2px;
    }

    /* 📱 Active state for touch feedback */
    :host(:active:not([disabled])) .radio-circle {
      transform: scale(0.95);
    }

    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .radio-circle,
      .radio-dot {
        transition: none;
      }
      
      :host(:active:not([disabled])) .radio-circle {
        transform: none;
      }
    }
  `;

  private _handleChange(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    // Radio buttons can only be checked, not unchecked by clicking
    if (!this.checked) {
      this.checked = true;

      // Uncheck other radios with the same name
      if (this.name) {
        this._uncheckOtherRadios();
      }

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('radio-change', {
        detail: {
          checked: this.checked,
          value: this.value,
          name: this.name
        },
        bubbles: true,
        composed: true
      }));

      // Dispatch native change event for form integration
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private _uncheckOtherRadios() {
    // Find all radio buttons with the same name in the document
    const radios = document.querySelectorAll(`lit-radio[name="${this.name}"]`);
    radios.forEach((radio) => {
      if (radio !== this && radio instanceof LitRadio) {
        radio.checked = false;
      }
    });
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    // Handle Space and Enter keys
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._handleChange(e);
    }

    // Arrow key navigation for radio groups
    if (this.name && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      this._navigateRadioGroup(e.key);
    }
  }

  private _navigateRadioGroup(key: string) {
    const radios = Array.from(document.querySelectorAll(`lit-radio[name="${this.name}"]`)) as LitRadio[];
    const enabledRadios = radios.filter(r => !r.disabled);
    const currentIndex = enabledRadios.indexOf(this);

    if (currentIndex === -1) return;

    let nextIndex: number;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledRadios.length;
    } else {
      nextIndex = (currentIndex - 1 + enabledRadios.length) % enabledRadios.length;
    }

    const nextRadio = enabledRadios[nextIndex];
    if (nextRadio) {
      nextRadio.focus();
      nextRadio.checked = true;
      nextRadio._handleChange(new Event('change'));
    }
  }

  private _handleMouseEnter() {
    if (!this.disabled) {
      this.setAttribute('data-hover', '');
    }
  }

  private _handleMouseLeave() {
    this.removeAttribute('data-hover');
  }

  render() {
    return html`
      <label class="radio-wrapper">
        <input
          type="radio"
          part="input"
          .checked="${this.checked}"
          .disabled="${this.disabled}"
          .name="${this.name}"
          .value="${this.value}"
          @change="${this._handleChange}"
          @keydown="${this._handleKeyDown}"
          tabindex="0"
          role="radio"
          aria-checked="${this.checked}"
          aria-disabled="${this.disabled}"
        />
        <div 
          class="radio-container"
          part="radio"
          @mouseenter="${this._handleMouseEnter}"
          @mouseleave="${this._handleMouseLeave}"
        >
          <div class="radio-circle" part="circle"></div>
          <div class="radio-dot" part="dot"></div>
        </div>
        ${this.label ? html`<span class="radio-label" part="label">${this.label}</span>` : ''}
        <slot></slot>
      </label>
    `;
  }

  // Make the component focusable
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex') && !this.disabled) {
      this.setAttribute('tabindex', '0');
    }
  }

  // Update tabindex when disabled changes
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this.setAttribute('tabindex', '-1');
      } else {
        this.setAttribute('tabindex', '0');
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-radio': LitRadio;
  }
}
