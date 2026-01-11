import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import './lit-icon';

/**
 * 📱 Mobile-optimized search input component based on the Design System
 * 
 * Designed exclusively for mobile applications with touch-first interactions.
 * Provides a search field with search icon, clear button, and responsive states.
 * 
 * @element lit-search-input
 * 
 * @attr {string} size - Size variant: 'medium' (44px) | 'large' (54px)
 * @attr {string} value - Current search query value
 * @attr {string} placeholder - Placeholder text shown when empty
 * @attr {boolean} disabled - Whether the search input is disabled
 * @attr {string} name - Name attribute for form submissions
 * 
 * @fires input - Fired when the search value changes (on tap and type)
 * @fires change - Fired when the input loses focus after value change
 * @fires focus - Fired when the input receives focus (on tap)
 * @fires blur - Fired when the input loses focus
 * @fires clear - Fired when the clear button is tapped
 * @fires search - Fired when the user submits the search (Enter key)
 * 
 * ## Mobile Features
 * - ✅ Touch-optimized: Large tap areas (44px minimum)
 * - ✅ Mobile keyboards: Search keyboard type with search button
 * - ✅ Tap to focus: Entire field area is tappable
 * - ✅ Clear button: Easy to clear search with one tap
 * - ✅ Visual feedback: Clear focus, hover, and active states
 * - ✅ Accessible: Full ARIA support and keyboard navigation
 * - ✅ Full-width: Responsive to mobile viewports
 * 
 * @csspart container - The main container element
 * @csspart input - The native input element
 * @csspart search-icon - The search icon element
 * @csspart clear-button - The clear button element
 * 
 * @example
 * ```html
 * <!-- Large search input (default) -->
 * <lit-search-input placeholder="Search destinations"></lit-search-input>
 * 
 * <!-- Medium search input -->
 * <lit-search-input size="medium" placeholder="Search"></lit-search-input>
 * 
 * <!-- With value -->
 * <lit-search-input value="Barcelona"></lit-search-input>
 * 
 * <!-- With event handling -->
 * <lit-search-input 
 *   placeholder="Search flights"
 *   @search="${(e) => console.log('Search:', e.detail.value)}"
 *   @clear="${() => console.log('Cleared')}">
 * </lit-search-input>
 * ```
 */
@customElement('lit-search-input')
export class LitSearchInput extends LitElement {
  static formAssociated = true;

  @property({ type: String }) size: 'medium' | 'large' = 'large';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Instruction';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';

  @state() private _focused = false;

  @query('input') private _input!: HTMLInputElement;

  private _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .container {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--gap-12, 12px);
      padding: 14px var(--gap-16, 16px);
      background-color: var(--color-neutral-white, #ffffff);
      border: 1px solid var(--color-secondary-200, #94b4d4);
      box-sizing: border-box;
      width: 100%;
      cursor: text;
      transition: border-color 0.2s ease;
    }

    /* Size variants */
    .container.size-large {
      height: 54px;
      border-radius: var(--border-radius-sm, 8px);
    }

    .container.size-medium {
      height: 44px;
      border-radius: 32px;
    }

    /* Hover state */
    .container:hover:not(.disabled) {
      border-color: var(--color-primary-500, #50b40a);
    }

    /* Focus state */
    .container.focused {
      border-color: var(--color-primary-500, #50b40a);
    }

    /* Search icon */
    .search-icon {
      flex-shrink: 0;
      color: var(--color-neutral-300, #73808c);
    }

    /* Input element */
    .input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--font-family-base, 'Lato', sans-serif);
      font-size: 18px;
      font-weight: var(--font-weight-normal, 400);
      line-height: normal;
      color: var(--color-neutral-black, #001f3d);
      padding: 0;
    }

    /* Style the native clear button */
    .input::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
      height: 24px;
      width: 24px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2373808c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      opacity: 1;
    }

    .input::-webkit-search-cancel-button:hover {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23001f3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');
    }

    .input::-webkit-search-cancel-button:active {
      transform: scale(0.95);
    }

    .input::placeholder {
      color: var(--color-neutral-300, #73808c);
      opacity: 1;
    }

    .input:disabled {
      cursor: not-allowed;
    }

    /* Ensure icons are properly sized */
    lit-icon {
      width: 24px;
      height: 24px;
    }

  `;

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this._updateFormValue();

    // Dispatch custom input event with detail
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this._updateFormValue();

    // Dispatch custom change event
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private _handleFocus() {
    this._focused = true;
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleBlur() {
    this._focused = false;
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('search', {
          bubbles: true,
          composed: true,
          detail: { value: this.value },
        })
      );
    }
  }

  private _handleContainerClick() {
    if (!this.disabled) {
      this._input?.focus();
    }
  }

  private _updateFormValue() {
    this._internals.setFormValue(this.value);
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value')) {
      this._updateFormValue();
    }
  }

  render() {
    const containerClasses = [
      'container',
      `size-${this.size}`,
      this._focused ? 'focused' : '',
      this.disabled ? 'disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div 
        class="${containerClasses}"
        part="container"
        @click="${this._handleContainerClick}"
      >
        <lit-icon 
          class="search-icon"
          part="search-icon"
          name="search"
        ></lit-icon>
        
        <input
          class="input"
          part="input"
          type="search"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          name="${this.name}"
          @input="${this._handleInput}"
          @change="${this._handleChange}"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @keydown="${this._handleKeyDown}"
          aria-label="${this.placeholder}"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-search-input': LitSearchInput;
  }
}
