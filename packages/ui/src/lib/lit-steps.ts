import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface Step {
  label: string;
  value?: string;
}

/**
 * Steps component for displaying multi-step progress in booking flows
 *
 * A horizontal progress indicator showing 4 steps with different states:
 * - Active: Current step (green indicator, green uppercase label)
 * - Done: Completed step (green check icon, white value text)
 * - Inactive: Future step (dark green indicator, white uppercase label)
 *
 * @element lit-steps
 *
 * @attr {number} current-step - Current active step (1-4)
 * @attr {string} steps - JSON string of step objects [{label: string, value?: string}]
 *
 * @fires step-click - Fired when a step is clicked. Detail: { step: number }
 *
 * @csspart container - The main container
 * @csspart step - Individual step container
 * @csspart indicator - Step indicator circle
 * @csspart label - Step label text
 * @csspart connector - Line connecting steps
 *
 * @example
 * ```html
 * <!-- Step 1 active with default labels -->
 * <lit-steps current-step="1"></lit-steps>
 *
 * <!-- Step 2 active with custom data -->
 * <lit-steps 
 *   current-step="2"
 *   .steps=${[
 *     { label: 'DATE', value: '17 Jan' },
 *     { label: 'AIRLINE' },
 *     { label: 'FLIGHT' },
 *     { label: '2 PAX' }
 *   ]}>
 * </lit-steps>
 *
 * <!-- Using JSON string attribute -->
 * <lit-steps 
 *   current-step="3"
 *   steps='[{"label":"DATE","value":"17 Jan"},{"label":"AIRLINE","value":"Eurowings"},{"label":"FLIGHT"},{"label":"2 PAX"}]'>
 * </lit-steps>
 * ```
 */
@customElement("lit-steps")
export class LitSteps extends LitElement {
  @property({ type: Number, attribute: "current-step" }) currentStep = 1;
  @property({ type: Array }) steps: Step[] = [
    { label: "DATE" },
    { label: "AIRLINE" },
    { label: "FLIGHT" },
    { label: "2 PAX" },
  ];

  static styles = css`
    :host {
      display: block;
      --step-indicator-size: 15px;
      --connector-height: 1px;
      --font-size: 12px;
      --letter-spacing: 1px;
      --line-height: 16px;
    }

    .container {
      position: relative;
      width: 340px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
      z-index: 2;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .step:hover {
      transform: scale(1.05);
    }

    .step:active {
      transform: scale(0.95);
    }

    .indicator-wrapper {
      padding: 8px;
      background: var(--color-primary-800);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -8px;
    }

    .indicator {
      width: var(--step-indicator-size);
      height: var(--step-indicator-size);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
    }

    .indicator.inactive {
      background: var(--color-primary-700);
      border: 1px solid var(--color-primary-700);
    }

    .indicator.active {
      border: 2px solid var(--color-primary-400);
    }

    .indicator.active::after {
      content: "";
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: var(--border-radius-full);
      background: var(--color-primary-400);
    }

    .indicator.done {
      background: var(--color-primary-400);
      border: 1px solid var(--color-primary-400);
    }

    .checkmark {
      width: 11px;
      height: 11px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .checkmark::before {
      content: "";
      position: absolute;
      width: 3px;
      height: 6px;
      border: solid var(--color-primary-600);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      left: 3px;
      top: 1px;
    }

    .label {
      font-family: var(--font-family-base);
      font-size: var(--font-size);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height);
      letter-spacing: var(--letter-spacing);
      text-align: center;
      white-space: nowrap;
    }

    .label.inactive {
      color: var(--color-neutral-white);
      text-transform: uppercase;
    }

    .label.active {
      color: var(--color-primary-400);
      text-transform: uppercase;
    }

    .label.done {
      color: var(--color-neutral-white);
    }

    .connectors {
      position: absolute;
      top: 7.5px;
      left: 7.5px;
      right: 7.5px;
      display: flex;
      z-index: 1;
    }

    .connector {
      flex: 1;
      height: var(--connector-height);
      background: var(--color-primary-700);
    }

    .connector.done {
      background: var(--color-primary-400);
    }
  `;

  private getStepState(stepNumber: number): "active" | "done" | "inactive" {
    if (stepNumber === this.currentStep) return "active";
    if (stepNumber < this.currentStep) return "done";
    return "inactive";
  }

  private handleStepClick(stepNumber: number) {
    this.dispatchEvent(
      new CustomEvent("step-click", {
        detail: { step: stepNumber },
        bubbles: true,
        composed: true,
      })
    );
  }

  private renderStep(stepNumber: number, step: Step) {
    const state = this.getStepState(stepNumber);
    const showValue = state === "done" && step.value;
    const displayText = showValue ? step.value : step.label;

    return html`
      <div
        class="step"
        part="step"
        @click=${() => this.handleStepClick(stepNumber)}
      >
        <div class="indicator-wrapper">
          <div class="indicator ${state}" part="indicator">
            ${state === "done"
        ? html`<div class="checkmark"></div>`
        : ""}
          </div>
        </div>
        <div class="label ${state}" part="label">
          ${displayText}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="container" part="container">
        <div class="connectors">
          ${this.steps.slice(0, -1).map((_, index) => html`
            <div
              class="connector ${this.currentStep > index + 1 ? "done" : ""}"
              part="connector"
            ></div>
          `)}
        </div>

        ${this.steps.map((step, index) => this.renderStep(index + 1, step))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-steps": LitSteps;
  }
}
