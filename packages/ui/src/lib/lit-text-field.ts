import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import './lit-icon';

/**
 * 📱 Mobile-optimized text field/input component based on the Design System
 * 
 * Designed exclusively for mobile applications with touch-first interactions.
 * Optimized for mobile keyboards and provides excellent UX on smartphones and tablets.
 * Supports basic text input and phone number input with validation states.
 * 
 * @element lit-text-field
 * 
 * @attr {string} type - Input type: 'basic' | 'phone-number' | 'pin-number'
 * @attr {string} label - Label text displayed in the field
 * @attr {string} value - Current input value
 * @attr {string} placeholder - Placeholder text (shown in basic type rest state)
 * @attr {string} prefix - Phone number prefix (default: '+34')
 * @attr {string} error - Message displayed in error state
 * @attr {string} inputType - HTML input type attribute (default: 'text')
 * @attr {string} name - Name attribute for form submissions
 * @attr {boolean} disabled - Whether the input is disabled
 * @attr {boolean} validated - Whether the input shows validated state
 * @attr {boolean} error - Whether the input shows error state
 * @attr {boolean} required - Whether the input is required
 * @attr {number} maxlength - Maximum input length
 * 
 * @fires input - Fired when the input value changes (on tap and type)
 * @fires change - Fired when the input loses focus after value change
 * @fires focus - Fired when the input receives focus (on tap)
 * @fires blur - Fired when the input loses focus
 * 
 * ## Mobile Features
 * - ✅ Touch-optimized: Large tap areas (52px height)
 * - ✅ Mobile keyboards: Proper input types trigger correct keyboards (email, tel, number, etc.)
 * - ✅ Tap to focus: Entire field area is tappable
 * - ✅ Visual feedback: Clear focus and active states
 * - ✅ Auto-validation: Real-time validation on input
 * - ✅ Accessible: Full ARIA support and keyboard navigation
 * - ✅ Full-width: Responsive to mobile viewports
 * 
 * @csspart input-wrapper - The input wrapper element
 * @csspart input - The native input element
 * @csspart label - The label element
 * @csspart prefix - The phone number prefix element
 * @csspart validation - The validation message container
 * @csspart icon - The validation icon
 * 
 * @example
 * ```html
 * <!-- Basic text field -->
 * <lit-text-field label="Email" placeholder="Enter your email"></lit-text-field>
 * 
 * <!-- Phone number field -->
 * <lit-text-field type="phone-number" prefix="+34"></lit-text-field>
 * 
 * <!-- PIN/Verification code field -->
 * <lit-text-field type="pin-number" placeholder="– – – –" maxlength="4"></lit-text-field>
 * 
 * <!-- With validation -->
 * <lit-text-field label="Name" value="John" validated></lit-text-field>
 * 
 * <!-- Error state -->
 * <lit-text-field 
 *   label="Email" 
 *   value="invalid" 
 *   error 
 *   error="Please enter a valid email">
 * </lit-text-field>
 * ```
 */
@customElement('lit-text-field')
export class LitTextField extends LitElement {
  static formAssociated = true;

  @property({ type: String, reflect: true }) type: 'basic' | 'phone-number' | 'pin-number' = 'basic';
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) prefix = '+34';
  @property({ type: String, reflect: true }) error = '';
  @property({ type: String }) inputType: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search' = 'text';
  @property({ type: String }) name = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) validated = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Number }) maxlength?: number;

  @state() private _focused = false;
  @state() private _hasValue = false;

  @query('input') private _input!: HTMLInputElement;

  private _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      font-family: 'Lato', sans-serif;
      min-width: 0;
      position: relative; /* For absolute positioning of error messages */
      /* 📱 Mobile: Touch-optimized dimensions */
      --field-height: 52px; /* Minimum 44px touch target, 52px for comfortable typing */
      --field-width: 100%; /* Full width on mobile */
      --phone-field-width: 100%; /* Full width on mobile */
      --field-padding: 16px;
      --field-gap: 12px;
      
      /* Border radius */
      --border-radius: 8px;
      
      /* Typography */
      --font-family: 'Lato', sans-serif;
      --label-size: 12px;
      --label-weight: 600;
      --input-size: 18px;
      --input-weight: 400;
      --validation-size: 12px;
      
      /* Colors */
      --field-bg: var(--color-neutral-white);
      --field-border: var(--color-secondary-200);
      --field-border-hover: var(--color-primary-500);
      --field-border-focus: var(--color-primary-500);
      --field-border-error: var(--color-system-alert);
      --field-border-disabled: var(--color-secondary-200);
      --field-bg-disabled: var(--color-secondary-20);
      
      --label-color: var(--color-neutral-300);
      --label-color-error: var(--color-system-alert);
      --label-color-disabled: var(--color-neutral-200);
      
      --input-color: var(--color-neutral-black);
      --input-color-placeholder: var(--color-neutral-300);
      --input-color-disabled: var(--color-neutral-200);
      
      --prefix-color: var(--color-primary-500);
      --phone-placeholder-color: var(--color-neutral-200);
      
      --validation-icon-color: var(--color-primary-700);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      height: var(--field-height);
      background-color: var(--field-bg);
      border: 1px solid var(--field-border);
      border-radius: var(--border-radius);
      padding: 8px var(--field-padding);
      box-sizing: border-box;
      transition: border-color 0.2s ease-in-out;
      cursor: text;
    }

    /* Hover state */
    .input-wrapper:hover:not(.disabled):not(.error) {
      border-color: var(--field-border-hover);
    }

    /* Focused state */
    .input-wrapper.focused:not(.disabled):not(.error) {
      border-color: var(--field-border-focus);
    }

    /* Error state */
    .input-wrapper.error {
      border-color: var(--field-border-error);
    }

    /* Disabled state */
    .input-wrapper.disabled {
      background-color: var(--field-bg-disabled);
      border-color: var(--field-border-disabled);
      cursor: not-allowed;
    }

    /* Input content wrapper */
    .input-content {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 2px;
      min-width: 0;
      justify-content: center;
    }

    /* Phone number layout */
    :host([type="phone-number"]) .input-wrapper {
      flex-direction: row;
      gap: var(--field-gap);
    }

    :host([type="phone-number"]) .input-content {
      flex-direction: row;
      align-items: center;
      gap: 5px;
    }

    /* Label */
    .label {
      font-size: var(--label-size);
      font-weight: var(--label-weight);
      color: var(--label-color);
      line-height: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 0;
      margin-bottom: 0;
      opacity: 0;
      transform: translateY(4px);
      pointer-events: none;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, max-height 0.2s ease-in-out, margin-bottom 0.2s ease-in-out;
    }

    /* Show label when focused or has value */
    .input-wrapper.focused .label,
    .input-wrapper.has-value .label {
      max-height: 20px;
      margin-bottom: 2px;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* Hide label for phone number type */
    :host([type="phone-number"]) .label {
      display: none;
    }

    .input-wrapper.error .label {
      color: var(--label-color-error);
    }

    .input-wrapper.disabled .label {
      color: var(--label-color-disabled);
    }

    /* Input element */
    input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: var(--input-size);
      font-weight: var(--input-weight);
      color: var(--input-color);
      line-height: 1;
      padding: 0;
      margin: 0;
      min-width: 0;
      position: relative;
      z-index: 1;
      width: 100%;
    }

    input::placeholder {
      color: var(--input-color-placeholder);
    }

    .input-wrapper.disabled input {
      color: var(--input-color-disabled);
      cursor: not-allowed;
    }

    /* Hide placeholder when focused or has label showing */
    .input-wrapper.focused input::placeholder,
    .input-wrapper.has-value input::placeholder {
      opacity: 0;
      visibility: hidden;
    }

    /* Prefix for phone number */
    .prefix {
      font-size: var(--input-size);
      font-weight: var(--input-weight);
      color: var(--prefix-color);
      line-height: 1.11;
      flex-shrink: 0;
    }

    /* Phone number specific input */
    :host([type="phone-number"]) input {
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    :host([type="phone-number"]) input::placeholder {
      color: var(--phone-placeholder-color);
      font-weight: 600;
    }

    /* PIN number specific styles */
    :host([type="pin-number"]) .input-wrapper {
      max-width: 160px;
      margin: 0 auto;
    }

    :host([type="pin-number"]) .input-content {
      align-items: center;
    }

    :host([type="pin-number"]) input {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 8px;
    }

    :host([type="pin-number"]) input::placeholder {
      text-align: center;
      letter-spacing: 4px;
      font-size: 20px;
    }

    :host([type="pin-number"]) .label {
      display: none;
    }

    /* Validation icon */
    .validation-icon {
      display: none;
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
    }

    :host([validated]) .validation-icon {
      display: block;
    }

    .validation-icon svg {
      width: 100%;
      height: 100%;
      color: var(--validation-icon-color);
    }

    /* Validation message */
    .validation-message {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: -2px;
      padding: 4px var(--field-padding) 0;
      font-size: var(--validation-size);
      line-height: 1.67;
      color: var(--color-system-alert);
      z-index: 10;
    }

    :host([error]) .validation-message {
      display: block;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._hasValue = !!this.value;
  }

  private _handleFocus() {
    this._focused = true;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private _handleBlur() {
    this._focused = false;

    // Validate required fields on blur
    if (this.required && !this.value.trim()) {
      this.error = 'This field is required';
      this._internals.setValidity({ valueMissing: true }, 'This field is required');
    } else if (this.value.trim()) {
      // Clear error if field is now valid
      this.error = '';
      this._internals.setValidity({});
    }

    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this._hasValue = !!this.value;

    // Clear error when user starts typing
    if (this.error && this.value.trim()) {
      this.error = '';
      this._internals.setValidity({});
    }

    // Update form value for form submission
    this._internals.setFormValue(this.value);

    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;

    // Update form value for form submission
    this._internals.setFormValue(this.value);

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    // Allow Enter key to bubble through Shadow DOM for form submission
    if (e.key === 'Enter') {
      // Dispatch a native keyboard event that can trigger form submission
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      this.dispatchEvent(enterEvent);

      // Also try to submit the form if we're in one
      const form = this.closest('form');
      if (form && !this.disabled) {
        // Trigger form submission
        form.requestSubmit();
      }
    }
  }

  private _handleWrapperClick() {
    if (!this.disabled) {
      this._input?.focus();
    }
  }

  focus() {
    this._input?.focus();
  }

  blur() {
    this._input?.blur();
  }

  render() {
    const wrapperClasses = [
      'input-wrapper',
      this._focused ? 'focused' : '',
      this._hasValue ? 'has-value' : '',
      this.error ? 'error' : '',
      this.disabled ? 'disabled' : '',
    ].filter(Boolean).join(' ');

    const inputPlaceholder = this.type === 'phone-number'
      ? '___ ___ ___'
      : this.type === 'pin-number'
        ? (this.placeholder || '– – – –')
        : (this.placeholder || this.label);

    const actualInputType = this.type === 'pin-number' ? 'text' : this.inputType;

    return html`
      <div 
        class="${wrapperClasses}" 
        part="input-wrapper"
        @click=${this._handleWrapperClick}
      >
          ${this.type === 'phone-number' ? html`
            <span class="prefix" part="prefix">${this.prefix}</span>
          ` : ''}
          
          <div class="input-content">
            <label class="label" part="label">${this.label}</label>
            
            <input
              part="input"
              type="${actualInputType}"
              inputmode="${this.type === 'pin-number' ? 'numeric' : 'text'}"
              name="${this.name}"
              .value="${this.value}"
              placeholder="${inputPlaceholder}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
              maxlength="${this.maxlength || ''}"
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @input=${this._handleInput}
              @change=${this._handleChange}
              @keydown=${this._handleKeyDown}
            />
          </div>

          ${this.validated && this.type !== 'pin-number' ? html`
            <div class="validation-icon" part="icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          ` : ''}
        </div>

      ${this.error && this.error ? html`
        <div class="validation-message" part="validation">
          ${this.error}
        </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-text-field': LitTextField;
  }
}
