import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * 📱 Mobile-optimized toggle switch component based on the Design System
 * 
 * Designed exclusively for mobile applications with touch-first interactions.
 * Perfect for settings panels, preferences, and binary on/off controls on mobile devices.
 * Includes large touch targets (44x44px minimum) and smooth animations.
 * 
 * @element lit-toggle
 * 
 * @attr {boolean} checked - Whether the toggle is checked/selected
 * @attr {boolean} disabled - Whether the toggle is disabled
 * @attr {string} name - Name attribute for form submissions
 * @attr {string} value - Value attribute for form submissions
 * 
 * @fires toggle-change - Fired when the toggle state changes (on tap/click)
 * 
 * @csspart toggle - The toggle container
 * @csspart background - The background track
 * @csspart circle - The sliding circle
 * 
 * @cssprop --toggle-bg-rest - Background color in rest state
 * @cssprop --toggle-bg-hover - Background color on hover (progressive enhancement)
 * @cssprop --toggle-bg-selected - Background color when selected
 * @cssprop --toggle-bg-active - Background color on active/press
 * @cssprop --toggle-bg-disabled - Background color when disabled
 * @cssprop --toggle-circle-color - Circle color
 * @cssprop --toggle-circle-disabled - Circle color when disabled
 * 
 * ## Mobile Features
 * - ✅ Touch-optimized: Minimum 44x44px touch target
 * - ✅ Tap interactions: Primary interaction method
 * - ✅ Smooth animations: Satisfying toggle feedback
 * - ✅ Active state feedback: Visual response on tap
 * - ✅ Keyboard navigation: Space/Enter for accessibility (external keyboards)
 * - ✅ Screen reader support: Full ARIA switch semantics
 * - ✅ Reduced motion: Respects prefers-reduced-motion
 * 
 * @example
 * ```html
 * <!-- Basic toggle -->
 * <lit-toggle></lit-toggle>
 * 
 * <!-- Checked toggle -->
 * <lit-toggle checked></lit-toggle>
 * 
 * <!-- Disabled toggle -->
 * <lit-toggle disabled></lit-toggle>
 * 
 * <!-- With event listener -->
 * <lit-toggle @toggle-change=${(e) => console.log(e.detail.checked)}></lit-toggle>
 * ```
 */
@customElement('lit-toggle')
export class LitToggle extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) value = '';

  @state() private _isPressed = false;

  static styles = css`
    :host {
      /* 📱 Mobile: Minimum touch target size */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 44px;
      
      --toggle-width: 50px;
      --toggle-height: 26px;
      --toggle-circle-size: 20px;
      --toggle-circle-offset: 3px;
      
      /* Color tokens */
      --toggle-bg-rest: var(--color-secondary-100);
      --toggle-bg-hover: var(--color-secondary-200);
      --toggle-bg-selected: var(--color-primary-700);
      --toggle-bg-active: var(--color-primary-900);
      --toggle-bg-disabled: var(--color-neutral-50);
      
      --toggle-circle-color: var(--color-neutral-white);
      --toggle-circle-disabled: var(--color-secondary-20);
    }

    .toggle-container {
      position: relative;
      width: var(--toggle-width);
      height: var(--toggle-height);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) .toggle-container {
      cursor: not-allowed;
      opacity: 1;
    }

    /* Hidden checkbox for accessibility */
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* Background track */
    .toggle-background {
      position: absolute;
      inset: 0;
      border-radius: var(--border-radius-full);
      background-color: var(--toggle-bg-rest);
      transition: background-color 0.2s ease-in-out;
    }

    /* Rest state (unchecked) */
    :host(:not([checked]):not([disabled])) .toggle-background {
      background-color: var(--toggle-bg-rest);
    }

    /* Hover state (unchecked) */
    :host(:not([checked]):not([disabled])) .toggle-container:hover .toggle-background {
      background-color: var(--toggle-bg-hover);
    }

    /* Selected state (checked) */
    :host([checked]:not([disabled])) .toggle-background {
      background-color: var(--toggle-bg-selected);
    }

    /* Active state (pressed while checked) */
    :host([checked]:not([disabled])) .toggle-container:active .toggle-background,
    :host([checked]:not([disabled])) .toggle-container.pressed .toggle-background {
      background-color: var(--toggle-bg-active);
    }

    /* Disabled state */
    :host([disabled]) .toggle-background {
      background-color: var(--toggle-bg-disabled);
    }

    /* Circle thumb */
    .toggle-circle {
      position: absolute;
      top: var(--toggle-circle-offset);
      left: var(--toggle-circle-offset);
      width: var(--toggle-circle-size);
      height: var(--toggle-circle-size);
      border-radius: var(--border-radius-full);
      background-color: var(--toggle-circle-color);
      transition: transform 0.2s ease-in-out;
      will-change: transform;
    }

    /* Circle position when checked */
    :host([checked]) .toggle-circle {
      transform: translateX(calc(var(--toggle-width) - var(--toggle-circle-size) - 2 * var(--toggle-circle-offset)));
    }

    /* Circle color when disabled */
    :host([disabled]) .toggle-circle {
      background-color: var(--toggle-circle-disabled);
    }

    /* Focus state for accessibility (external keyboards) */
    input[type="checkbox"]:focus-visible ~ .toggle-background {
      outline: 2px solid var(--color-primary-300);
      outline-offset: 2px;
    }

    /* 📱 Active state for touch feedback */
    :host(:active:not([disabled])) .toggle-background {
      transform: scale(0.95);
    }

    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .toggle-background,
      .toggle-circle {
        transition: none;
      }
      
      :host(:active:not([disabled])) .toggle-background {
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
    this.dispatchEvent(new CustomEvent('toggle-change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true
    }));

    // Dispatch native change event for form integration
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    // Handle Space and Enter keys
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._handleClick(e);
    }
  }

  private _handleMouseDown() {
    if (!this.disabled) {
      this._isPressed = true;
    }
  }

  private _handleMouseUp() {
    this._isPressed = false;
  }

  render() {
    return html`
      <div 
        class="toggle-container ${this._isPressed ? 'pressed' : ''}"
        role="switch"
        aria-checked="${this.checked}"
        aria-disabled="${this.disabled}"
        tabindex="${this.disabled ? -1 : 0}"
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
        @mouseleave=${this._handleMouseUp}
        part="toggle"
      >
        <input
          type="checkbox"
          .checked=${this.checked}
          .disabled=${this.disabled}
          name=${this.name}
          value=${this.value}
          aria-hidden="true"
          tabindex="-1"
        />
        <div class="toggle-background" part="background"></div>
        <div class="toggle-circle" part="circle"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-toggle': LitToggle;
  }
}
