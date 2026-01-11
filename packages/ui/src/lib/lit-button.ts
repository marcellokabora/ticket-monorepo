import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lit-icon';

/**
 * A button component based on the Design System
 * Uses slots for flexible content composition
 * 
 * @element lit-button
 * 
 * @slot - Default slot for all button content (text, icons, etc.). You control the order.
 * 
 * @attr {string} variant - Button variant: 'primary' | 'secondary' | 'tertiary' | 'default'
 * @attr {string} size - Button size: 'small' | 'medium' | 'large'
 * @attr {string} rounded - Border radius style: 'full' | 'sm' | 'md' | 'lg'
 * @attr {string} type - Button type: 'button' | 'submit' | 'reset'
 * @attr {boolean} disabled - Whether the button is disabled
 * @attr {boolean} active - Whether the button is in active/selected state (for pagination, tabs, etc.)
 * @attr {boolean} loading - Whether the button is in loading state with spinner
 * @attr {string} class - CSS classes to apply to the host element (supports Tailwind classes)
 * 
 * @csspart button - The internal button element
 * 
 * @example
 * ```html
 * <!-- Button automatically adapts to parent context -->
 * <lit-button variant="secondary" size="small">
 *   Menu
 *   <lit-icon icon="mdi:menu"></lit-icon>
 * </lit-button>
 * 
 * <!-- Primary button -->
 * <lit-button variant="primary" size="medium">
 *   Submit
 * </lit-button>
 * ```
 */
@customElement('lit-button')
export class LitButton extends LitElement {
  @property({ type: String }) variant: 'primary' | 'secondary' | 'tertiary' | 'default' | 'pillar-black' | 'pillar-blue' = 'default';
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: String }) rounded: 'full' | 'sm' | 'md' | 'lg' = 'full';
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) active = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) class = '';

  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly = false;

  private handleClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // If type is submit, trigger form submission
    if (this.type === 'submit') {
      const form = this.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }

    // Dispatch a custom event that bubbles up
    this.dispatchEvent(new CustomEvent('button-click', {
      bubbles: true,
      composed: true,
      detail: { originalEvent: event }
    }));
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-sizing: border-box;
      width: 100%;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      font-family: 'Lato', sans-serif;
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      letter-spacing: 0.5px;
      text-align: center;
      border-radius: var(--button-border-radius);
      /* corner-shape: squircle; */
      padding: 6px 16px;
      background: transparent;
    }

    button:active:not(:disabled) {
      transform: scale(0.95);
      transition: transform 0.1s ease-in-out;
    }

    /* Size variants */
    button.small {
      height: auto;
      min-height: 36px;
      padding: 6px 16px;
      font-size: 14px;
    }

    :host([icon-only]) button.small {
      height: 36px;
      width: 36px;
      min-width: 36px;
      padding: 8px;
      border-radius: 50%;
    }

    button.medium {
      height: var(--button-size-md);
      padding: 8px 24px;
      font-size: 16px;
    }

    :host([icon-only]) button.medium {
      height: 48px;
      width: 48px;
      min-width: 48px;
      padding: 12px;
      border-radius: 50%;
    }

    button.large {
      height: var(--button-size-lg);
      padding: 12px 32px;
      font-size: 18px;
    }

    :host([icon-only]) button.large {
      height: 60px;
      width: 60px;
      min-width: 60px;
      padding: 16px;
      border-radius: 50%;
    }

    /* Secondary type */
    button.secondary {
      border: 1px solid var(--color-primary-300);
      color: currentColor;
    }

    button.secondary:hover:not(:disabled) {
      background-color: var(--color-primary-300);
      color: var(--color-neutral-black);
    }

    /* Tertiary type */
    button.tertiary {
      border: 1px solid var(--color-secondary-300);
      background-color: transparent;
      color: currentColor;
      background-color: var(--color-neutral-white);
    }

    button.tertiary:hover:not(:disabled) {
      border-color: var(--color-primary-500);
    }

    button.tertiary.active {
      background-color: var(--color-secondary-100);
      border-color: var(--color-secondary-200);
      color: var(--color-neutral-black);
    }

    button.tertiary.active:hover:not(:disabled) {
      background-color: var(--color-secondary-100);
      border-color: var(--color-secondary-200);
    }

    /* Primary type */
    button.primary {
      background-color: var(--color-primary-300);
      border: none;
      color: var(--color-neutral-black);
    }

    button.primary:hover:not(:disabled) {
      background-color: var(--color-primary-400);
    }

    /* Default type */
    button.default {
      background-color: transparent;
      border: none;
      color: currentColor;
    }

    /* button.default:hover:not(:disabled) {
      background-color: var(--color-neutral-white);
    } */

    /* Pillar Black type */
    button.pillar-black {
      background-color: var(--color-neutral-black);
      border: none;
      color: var(--color-neutral-white);
      opacity: 0.8;
    }

    button.pillar-black:hover:not(:disabled) {
      opacity: 1;
    }

    /* Pillar Blue type */
    button.pillar-blue {
      background-color: var(--color-secondary-40);
      border: none;
      color: var(--color-secondary-200);
      border: 1px solid transparent
    }

    button.pillar-blue:hover:not(:disabled) {
      background-color: var(--color-secondary-100);
      border: 1px solid var(--color-secondary-200);
    }

    /* Rounded variants */
    button.rounded-full {
      border-radius: var(--border-radius-full);
    }

    button.rounded-sm {
      border-radius: var(--border-radius-sm);
    }

    button.rounded-md {
      border-radius: var(--border-radius-md);
    }

    button.rounded-lg {
      border-radius: var(--border-radius-lg);
    }

    /* Disabled state */
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Focus state for accessibility */
    button:focus-visible {
      outline: 2px solid var(--color-primary-300);
      outline-offset: 2px;
    }

    /* Slot styling for all slotted elements */
    ::slotted(*) {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Icons stay at edges, text/span fills space */
    ::slotted(lit-icon) {
      flex-shrink: 0;
    }

    ::slotted(span) {
      flex: 1;
      text-align: center;
    }

    /* Loading state */
    button.loading {
      position: relative;
      pointer-events: none;
      color: transparent;
    }

    button.loading ::slotted(*) {
      opacity: 0 !important;
      visibility: hidden;
    }

    .spinner {
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      opacity: 1;
      color: var(--color-primary-800);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  render() {
    const classes = `${this.variant} ${this.size} rounded-${this.rounded} ${this.loading ? 'loading' : ''} ${this.active ? 'active' : ''} ${this.class}`;

    return html`
      <button
        type=${this.type}
        class=${classes}
        ?disabled=${this.disabled}
        part="button"
        @click=${this.handleClick}
      >
        ${this.loading ? html`<div class="spinner"></div>` : ''}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-button': LitButton;
  }
}
