import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./lit-steps";
import "./lit-mobile-viewport";

const meta: Meta = {
  title: "Design System/Steps",
  component: "lit-steps",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    currentStep: {
      control: { type: "select" },
      options: [1, 2, 3, 4],
      description: "Current active step (1-4)",
    },
    steps: {
      control: "object",
      description: "Array of step objects with label and optional value",
    },
  },
  args: {
    currentStep: 1,
    steps: [
      { label: "DATE" },
      { label: "AIRLINE" },
      { label: "FLIGHT" },
      { label: "2 PAX" },
    ],
  },
};

export default meta;
type Story = StoryObj;

/**
 * Interactive playground to test the steps component with all controls
 */
export const Playground: Story = {
  render: (args) => html`
    <lit-steps
      current-step=${args.currentStep}
      .steps=${args.steps}
    ></lit-steps>
  `,
};

/**
 * All possible states of the steps component
 */
export const AllStates: Story = {
  render: () => html`
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-neutral-white">Step 1 - Date Selection</h3>
        <lit-steps current-step="1"></lit-steps>
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-neutral-white">Step 2 - Airline Selection</h3>
        <lit-steps
          current-step="2"
          .steps=${[
      { label: "DATE", value: "17 Jan" },
      { label: "AIRLINE" },
      { label: "FLIGHT" },
      { label: "2 PAX" },
    ]}
        ></lit-steps>
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-neutral-white">Step 3 - Flight Selection</h3>
        <lit-steps
          current-step="3"
          .steps=${[
      { label: "DATE", value: "17 Jan" },
      { label: "AIRLINE", value: "Eurowings" },
      { label: "FLIGHT" },
      { label: "2 PAX" },
    ]}
        ></lit-steps>
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-neutral-white">Step 4 - Passenger Details</h3>
        <lit-steps
          current-step="4"
          .steps=${[
      { label: "DATE", value: "17 Jan" },
      { label: "AIRLINE", value: "Eurowings" },
      { label: "FLIGHT", value: "FR18911" },
      { label: "2 PAX" },
    ]}
        ></lit-steps>
      </div>
    </div>
  `,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Steps component in a realistic mobile booking flow context
 */
export const InContext: Story = {
  render: () => {
    const handleStepClick = (e: CustomEvent) => {
      console.log("Step clicked:", e.detail);
      alert(`Navigating to step ${e.detail.step}`);
    };

    return html`
      <lit-mobile-viewport width="small" background="blue">
        <div class="flex flex-col gap-6 bg-primary-800">
          <div class="p-4 bg-primary-800 flex flex-col gap-4">
            <h2 class="text-xl font-bold text-neutral-white">
              Book Your Priority Pass
            </h2>

            <lit-steps
              current-step="2"
              .steps=${[
        { label: "DATE", value: "17 Jan" },
        { label: "AIRLINE" },
        { label: "FLIGHT" },
        { label: "2 PAX" },
      ]}
              @step-click=${handleStepClick}
            ></lit-steps>

          </div>

          <div class="bg-white rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4 text-neutral-black">
              Select Your Airline
            </h3>
            <p class="text-neutral-500 mb-4">
              Choose the airline you'll be flying with on January 17th
            </p>
            <div class="flex flex-col gap-3">
              <button class="p-4 border border-secondary-200 rounded-lg text-left hover:bg-secondary-20">
                <div class="font-semibold text-neutral-black">Eurowings</div>
                <div class="text-sm text-neutral-300">Low-cost carrier</div>
              </button>
              <button class="p-4 border border-secondary-200 rounded-lg text-left hover:bg-secondary-20">
                <div class="font-semibold text-neutral-black">Lufthansa</div>
                <div class="text-sm text-neutral-300">Full-service airline</div>
              </button>
              <button class="p-4 border border-secondary-200 rounded-lg text-left hover:bg-secondary-20">
                <div class="font-semibold text-neutral-black">Ryanair</div>
                <div class="text-sm text-neutral-300">Budget airline</div>
              </button>
            </div>
          </div>
        </div>
      </lit-mobile-viewport>
    `;
  },
};
