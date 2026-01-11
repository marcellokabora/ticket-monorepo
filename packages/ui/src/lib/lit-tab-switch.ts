import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * 📱 Tab Switch component based on the Design System
 * 
 * A two-tab switch component for binary choices (like Email/SMS selection).
 * Designed with touch-first interactions and smooth visual feedback.
 * 
 * @element lit-tab-switch
 * 
 * @attr {number} activeTab - The currently active tab (0 or 1)
 * @attr {string} label1 - Label for the first tab
 * @attr {string} label2 - Label for the second tab
 * @attr {boolean} disabled - Whether the tab switch is disabled
 * 
 * @fires tab-change - Fired when a tab is selected
 * 
 * @csspart container - The tab switch container
 * @csspart tab - Individual tab elements
 * @csspart tab-active - The active tab element
 * 
 * @cssprop --tab-height - Height of the tab switch (default: 52px)
 * @cssprop --tab-bg-active - Background color for active tab
 * @cssprop --tab-bg-rest - Background color for inactive tab
 * @cssprop --tab-border-active - Border color for active tab
 * @cssprop --tab-text-color - Text color for tabs
 * @cssprop --tab-border-radius - Border radius for tabs
 * 
 * ## Features
 * - ✅ Touch-optimized: Large tap targets
 * - ✅ Smooth transitions: Visual feedback on selection
 * - ✅ Keyboard navigation: Arrow keys and Tab support
 * - ✅ Screen reader support: Full ARIA tab semantics
 * - ✅ Accessible: Proper focus management
 * 
 * @example
 * ```html
 * <!-- Basic tab switch -->
 * <lit-tab-switch label1="Email" label2="SMS"></lit-tab-switch>
 * 
 * <!-- With custom active tab -->
 * <lit-tab-switch label1="Option 1" label2="Option 2" activeTab="1"></lit-tab-switch>
 * 
 * <!-- With event listener -->
 * <lit-tab-switch 
 *   label1="Email" 
 *   label2="SMS"
 *   @tab-change=${(e) => console.log('Active tab:', e.detail.activeTab, e.detail.label)}
 * ></lit-tab-switch>
 * ```
 */
@customElement('lit-tab-switch')
export class LitTabSwitch extends LitElement {
  @property({ type: Number, reflect: true, attribute: 'active-tab' }) activeTab = 0;
  @property({ type: String }) label1 = 'Email';
  @property({ type: String }) label2 = 'SMS';
  @property({ type: Boolean, reflect: true }) disabled = false;

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      
      /* CSS Custom Properties */
      --tab-height: 52px;
      --tab-bg-active: var(--color-secondary-20, #f5f7fa);
      --tab-bg-container: var(--color-secondary-40, #e6ecf3);
      --tab-border-active: var(--color-primary-500, #50b40a);
      --tab-text-color: var(--color-neutral-black, #001f3d);
      --tab-border-radius-outer: 22px;
      --tab-border-radius-inner: 20px;
    }

    .tab-switch {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      padding-bottom: 0;
      background: var(--tab-bg-container);
      border-radius: var(--tab-border-radius-outer) var(--tab-border-radius-outer) 0 0;
      position: relative;
      width: 100%;
    }

    .tab-container {
      display: flex;
      align-items: stretch;
      height: var(--tab-height);
      position: relative;
      flex: 1;
    }

    .sliding-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: var(--tab-bg-active);
      border-radius: var(--tab-border-radius-inner) var(--tab-border-radius-inner) 0 0;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      z-index: 0;
      will-change: transform;
    }
    
    .sliding-background::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--tab-border-active);
    }

    .sliding-background[data-position="1"] {
      transform: translateX(100%);
    }

    .tab {
      flex: 1 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 19px 64px;
      min-width: 0;
      min-height: 0;
      cursor: pointer;
      position: relative;
      z-index: 1;
      border-radius: var(--tab-border-radius-inner) var(--tab-border-radius-inner) 0 0;
      
      /* Default state - no background, it's handled by sliding-background */
      background: transparent;
      border: none;
      
      /* Text styling */
      font-family: 'Lato', sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0.5px;
      text-align: center;
      color: var(--tab-text-color);
      
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    .tab:focus-visible {
      outline: 2px solid var(--color-primary-500, #50b40a);
      outline-offset: 2px;
      z-index: 1;
    }

    .tab[data-active="true"] {
      font-weight: 600;
      cursor: default;
    }

    :host([disabled]) .tab {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    .tab-label {
      white-space: nowrap;
      position: relative;
    }

    /* Ghost text technique: Reserve space for bold text to prevent layout shift */
    .tab-label::before {
      content: attr(data-label);
      font-weight: 600;
      visibility: hidden;
      height: 0;
      display: block;
      overflow: hidden;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .tab {
        transition: none;
      }
    }
  `;

  private handleTabClick(index: number) {
    if (this.disabled || this.activeTab === index) {
      return;
    }

    const oldTab = this.activeTab;
    this.activeTab = index;

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: {
        activeTab: index,
        label: index === 0 ? this.label1 : this.label2,
        oldTab
      }
    }));
  }

  private handleKeyDown(event: KeyboardEvent, index: number) {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleTabClick(index);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const newIndex = event.key === 'ArrowLeft' ? 0 : 1;
      this.handleTabClick(newIndex);

      // Focus the newly selected tab
      const tabs = this.shadowRoot?.querySelectorAll('.tab');
      if (tabs?.[newIndex]) {
        (tabs[newIndex] as HTMLElement).focus();
      }
    }
  }

  render() {
    return html`
      <div class="tab-switch" part="container" role="tablist">
        <div class="tab-container">
          <div 
            class="sliding-background" 
            data-position="${this.activeTab}"
            part="sliding-background"
          ></div>
          <div
            class="tab"
            part="${this.activeTab === 0 ? 'tab tab-active' : 'tab'}"
            role="tab"
            tabindex="${this.activeTab === 0 ? '0' : '-1'}"
            aria-selected="${this.activeTab === 0}"
            aria-disabled="${this.disabled}"
            data-active="${this.activeTab === 0}"
            @click=${() => this.handleTabClick(0)}
            @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 0)}
          >
            <span class="tab-label" data-label="${this.label1}">${this.label1}</span>
          </div>
          <div
            class="tab"
            part="${this.activeTab === 1 ? 'tab tab-active' : 'tab'}"
            role="tab"
            tabindex="${this.activeTab === 1 ? '0' : '-1'}"
            aria-selected="${this.activeTab === 1}"
            aria-disabled="${this.disabled}"
            data-active="${this.activeTab === 1}"
            @click=${() => this.handleTabClick(1)}
            @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, 1)}
          >
            <span class="tab-label" data-label="${this.label2}">${this.label2}</span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-tab-switch': LitTabSwitch;
  }
}
