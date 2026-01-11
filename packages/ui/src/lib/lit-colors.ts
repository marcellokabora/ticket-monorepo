import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  rgb: string;
}

export interface ColorPalette {
  category: string;
  colors: ColorToken[];
}

/**
 * Color Swatch Component
 * 
 * Displays a single color swatch with its details
 * 
 * @element lit-color-swatch
 * 
 * @example
 * ```html
 * <lit-color-swatch 
 *   name="300 - Lime (default)" 
 *   variable="--color-primary-300"
 *   hex="#A0EB78"
 *   rgb="160, 235, 120">
 * </lit-color-swatch>
 * ```
 */
@customElement('lit-color-swatch')
export class LitColorSwatch extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) variable = '';
  @property({ type: String }) hex = '';
  @property({ type: String }) rgb = '';

  static styles = css`
    :host {
      display: block;
      font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .swatch-container {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .color-box {
      width: 100px;
      height: 100px;
      border-radius: 4px;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }

    .color-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .color-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-neutral-black);
    }

    .color-detail {
      font-size: 12px;
      color: var(--color-neutral-500);
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .color-variable {
      font-size: 11px;
      color: var(--color-neutral-300);
      font-family: 'Monaco', 'Courier New', monospace;
    }
  `;

  render() {
    return html`
      <div class="swatch-container">
        <div class="color-box" style="background-color: var(${this.variable}, ${this.hex});"></div>
        <div class="color-info">
          <div class="color-name">${this.name}</div>
          <div class="color-detail">${this.hex}</div>
          <div class="color-detail">${this.rgb}</div>
          <div class="color-variable">${this.variable}</div>
        </div>
      </div>
    `;
  }
}

/**
 * Colors Component
 * 
 * Displays the complete color palette organized by category
 * 
 * @element lit-colors
 * 
 * @example
 * ```html
 * <lit-colors></lit-colors>
 * ```
 */
@customElement('lit-colors')
export class LitColors extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 24px;
    }

    .colors-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 48px;
    }

    .palette-section {
      display: flex;
      flex-direction: column;
    }

    .palette-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      color: var(--color-neutral-black);
      border-bottom: 2px solid var(--color-primary-300);
      padding-bottom: 8px;
    }
  `;

  private palettes: ColorPalette[] = [
    {
      category: 'Primary',
      colors: [
        { name: '100 - Cream', variable: '--color-primary-100', hex: '#C8F0B4', rgb: '200, 240, 180' },
        { name: '200 - Pastel', variable: '--color-primary-200', hex: '#BEEBA0', rgb: '190, 235, 160' },
        { name: '300 - Lime (default)', variable: '--color-primary-300', hex: '#A0EB78', rgb: '160, 235, 120' },
        { name: '400 - Fresh-green', variable: '--color-primary-400', hex: '#6ED22D', rgb: '110, 210, 45' },
        { name: '500 - Grass', variable: '--color-primary-500', hex: '#50B40A', rgb: '80, 180, 10' },
        { name: '600 - Forest', variable: '--color-primary-600', hex: '#328200', rgb: '50, 130, 0' },
        { name: '700 - Camarone', variable: '--color-primary-700', hex: '#0F6446', rgb: '15, 100, 70' },
        { name: '800 - Dark-green', variable: '--color-primary-800', hex: '#0A412D', rgb: '10, 65, 45' },
        { name: '900 - Black-green', variable: '--color-primary-900', hex: '#052819', rgb: '5, 40, 25' },
      ],
    },
    {
      category: 'Secondary',
      colors: [
        { name: '20', variable: '--color-secondary-20', hex: '#F5F7FA', rgb: '245, 247, 250' },
        { name: '40', variable: '--color-secondary-40', hex: '#E6ECF3', rgb: '230, 236, 243' },
        { name: '80', variable: '--color-secondary-80', hex: '#DEE5ED', rgb: '222, 229, 237' },
        { name: '100', variable: '--color-secondary-100', hex: '#B8CCE0', rgb: '184, 204, 224' },
        { name: '200', variable: '--color-secondary-200', hex: '#94B4D4', rgb: '148, 180, 212' },
        { name: '300', variable: '--color-secondary-300', hex: '#698DAF', rgb: '105, 141, 175' },
        { name: '400', variable: '--color-secondary-400', hex: '#478CD1', rgb: '71, 140, 209' },
        { name: '500', variable: '--color-secondary-500', hex: '#3473B2', rgb: '52, 115, 178' },
        { name: '800', variable: '--color-secondary-800', hex: '#113E73', rgb: '17, 62, 115' },
      ],
    },
    {
      category: 'Neutral',
      colors: [
        { name: 'white', variable: '--color-neutral-white', hex: '#FFFFFF', rgb: '255, 255, 255' },
        { name: '50', variable: '--color-neutral-50', hex: '#E3E6E8', rgb: '227, 230, 232' },
        { name: '100', variable: '--color-neutral-100', hex: '#C7CCD1', rgb: '199, 204, 209' },
        { name: '200', variable: '--color-neutral-200', hex: '#A9B8C6', rgb: '169, 184, 198' },
        { name: '300', variable: '--color-neutral-300', hex: '#73808C', rgb: '115, 128, 140' },
        { name: '500', variable: '--color-neutral-500', hex: '#3D4D5C', rgb: '61, 77, 92' },
        { name: 'black', variable: '--color-neutral-black', hex: '#001F3D', rgb: '0, 31, 61' },
      ],
    },
    {
      category: 'System',
      colors: [
        { name: 'Link', variable: '--color-system-link', hex: '#0057DA', rgb: '0, 87, 218' },
        { name: 'Alert', variable: '--color-system-alert', hex: '#EB5757', rgb: '235, 87, 87' },
        { name: 'Success', variable: '--color-system-success', hex: '#4EB40C', rgb: '78, 180, 12' },
        { name: 'Comments', variable: '--color-system-comments', hex: '#5D00F4', rgb: '93, 0, 244' },
      ],
    },
  ];

  render() {
    return html`
      <div class="colors-container">
        ${this.palettes.map(
      (palette) => html`
            <div class="palette-section">
              <h2 class="palette-title">${palette.category}</h2>
              ${palette.colors.map(
        (color) => html`
                  <lit-color-swatch
                    name=${color.name}
                    variable=${color.variable}
                    hex=${color.hex}
                    rgb=${color.rgb}
                  ></lit-color-swatch>
                `
      )}
            </div>
          `
    )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-color-swatch': LitColorSwatch;
    'lit-colors': LitColors;
  }
}
