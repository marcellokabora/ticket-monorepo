import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import 'iconify-icon';
import { iconDefinitions, generateIconSvg } from './images/icons/icon-definitions.js';

/**
 * A versatile Lit icon component supporting both Iconify icons and custom design system icons
 * 
 * @element lit-icon
 * 
 * @example
 * ```html
 * <!-- Iconify icon -->
 * <lit-icon icon="mdi:home"></lit-icon>
 * <lit-icon icon="mdi:account" size="32px" color="blue"></lit-icon>
 * 
 * <!-- Custom design system icon -->
 * <lit-icon name="check"></lit-icon>
 * <lit-icon name="search" size="32px" color="red"></lit-icon>
 * ```
 */
@customElement('lit-icon')
export class LitIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    iconify-icon {
      display: flex;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  /**
   * The icon name for custom design system icons (e.g., "check", "search", "menu")
   * When set, this takes precedence over the "icon" property
   */
  @property({ type: String })
  name = '';

  /**
   * The icon name in Iconify format "collection:name" (e.g., "mdi:home")
   * Only used if "name" is not set
   */
  @property({ type: String })
  icon = 'mdi:help';

  /**
   * Icon size (e.g., "24px", "2em", "32")
   */
  @property({ type: String })
  size = '24px';

  /**
   * Icon color (any CSS color value)
   * For custom icons, defaults to "currentColor" to inherit from parent
   */
  @property({ type: String })
  color = 'currentColor';

  render() {
    // If name is provided, use custom icon from icon-definitions
    if (this.name && iconDefinitions[this.name]) {
      const svgString = generateIconSvg(this.name, this.size, this.color);
      return html`
        <div style="width: ${this.size}; height: ${this.size}; color: ${this.color}">
          ${unsafeSVG(svgString)}
        </div>
      `;
    }

    // Otherwise, use Iconify
    return html`
      <iconify-icon
        icon=${this.icon}
        width=${this.size}
        height=${this.size}
        style="color: ${this.color}"
      ></iconify-icon>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-icon': LitIcon;
  }
}
