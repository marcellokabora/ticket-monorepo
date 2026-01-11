import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A card component with a distinctive "bite" effect at the top center.
 * Perfect for ticket-style layouts and special content containers.
 *
 * @element lit-bite-card
 *
 * @attr {string} background - Background color of the card. Options: "white" (default), "light"
 * @attr {string} bite-color - Color of the bite separator at top. Defaults to primary-800
 *
 * @slot - Default slot for card content
 *
 * @csspart container - The main card container
 * @csspart bite - The bite separator element
 *
 * @example
 * ```html
 * <lit-bite-card>
 *   <p>Your content here</p>
 * </lit-bite-card>
 * ```
 */
@customElement("lit-bite-card")
export class LitBiteCard extends LitElement {
  @property({ type: String }) background = "white";
  @property({ type: String, attribute: "bite-color" }) biteColor = "primary-800";

  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: relative;
      margin-top: -38px;
      padding-top: 8px;
    }

    .card-container {
      position: relative;
    }

    .card-content {
      border-radius: var(--border-radius-xl);
      overflow: hidden;
      position: relative;
    }

    .card-content.bg-white {
      background: var(--color-neutral-white);
    }

    .card-content.bg-light {
      background: var(--color-secondary-20);
    }

    .bite {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 75px;
      height: 50px;
      border-radius: 100%;
      z-index: 1;
    }

    .bite.color-primary-800 {
      background: var(--color-primary-800);
    }

    .bite.color-primary-700 {
      background: var(--color-primary-700);
    }

    .bite.color-secondary-800 {
      background: var(--color-secondary-800);
    }

    .bite.color-white {
      background: var(--color-neutral-white);
    }

    .content {
      position: relative;
      z-index: 1;
    }
  `;

  render() {
    return html`
      <div class="card-container" part="container">
        <div class="bite color-${this.biteColor}" part="bite"></div>
        <div class="card-content bg-${this.background}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-bite-card": LitBiteCard;
  }
}
