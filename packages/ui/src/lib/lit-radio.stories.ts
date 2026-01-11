import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-radio';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';
import './lit-toggle';

const meta: Meta = {
  title: 'Design System/Radio',
  component: 'lit-radio',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the radio is checked/selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text for the radio button',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submissions (groups radios together)',
    },
    value: {
      control: 'text',
      description: 'Value attribute for form submissions',
    },
  },
  args: {
    checked: false,
    disabled: false,
    label: 'Radio Label',
    name: 'demo-group',
    value: 'option-1',
  },
};

export default meta;
type Story = StoryObj;

// Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <lit-radio
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      label="${args.label}"
      name="${args.name}"
      value="${args.value}"
      @radio-change="${(e: CustomEvent) => {
      console.log('Radio changed:', e.detail);
    }}"
    ></lit-radio>
  `,
};

// All visual states (📱 Mobile viewport)
export const AllStates: Story = {
  render: () => html`
      
      <div class="flex flex-col gap-4">
        <!-- Rest State -->
        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Rest (Unchecked)</h3>
          <lit-radio name="state-demo-rest" value="rest" label="Tap to select"></lit-radio>
        </div>

        <!-- Selected State -->
        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Selected (Checked)</h3>
          <lit-radio name="state-demo-selected" value="selected" label="Selected state" checked></lit-radio>
        </div>

        <!-- Disabled State -->
        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Disabled (Unchecked)</h3>
          <lit-radio name="state-demo-disabled" value="disabled" label="Disabled state" disabled></lit-radio>
        </div>

        <!-- Disabled + Selected State -->
        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Disabled + Selected</h3>
          <lit-radio name="state-demo-disabled-selected" value="disabled-selected" label="Disabled & selected" checked disabled></lit-radio>
        </div>
      </div>
  `,
};

// Real-world context examples (📱 Mobile viewport)
export const InContext: Story = {
  render: () => html`
    <lit-mobile-viewport width="small" background="white">
      <div class="flex flex-col h-full p-6">
        <h2 class="text-lg font-semibold mb-2">Satisfaction Survey</h2>
        <p class="text-gray-500 text-sm mb-4">
          Rate your experience
        </p>

      <div class="mb-5">
        <label class="block text-sm font-semibold mb-2">
          How would you rate our service?
        </label>
        <div class="flex flex-col gap-2">
          <lit-radio name="satisfaction" value="5" label="⭐⭐⭐⭐⭐ Excellent"></lit-radio>
          <lit-radio name="satisfaction" value="4" label="⭐⭐⭐⭐ Good"></lit-radio>
          <lit-radio name="satisfaction" value="3" label="⭐⭐⭐ Average"></lit-radio>
          <lit-radio name="satisfaction" value="2" label="⭐⭐ Below Average"></lit-radio>
          <lit-radio name="satisfaction" value="1" label="⭐ Poor"></lit-radio>
        </div>
      </div>

      <div class="mb-5">
        <label class="block text-sm font-semibold mb-2">
          Would you recommend us?
        </label>
        <div class="flex flex-col gap-2">
          <lit-radio name="recommend" value="yes" label="Yes" checked></lit-radio>
          <lit-radio name="recommend" value="no" label="No"></lit-radio>
          <lit-radio name="recommend" value="maybe" label="Maybe"></lit-radio>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <lit-button variant="secondary" size="medium">Skip</lit-button>
        <lit-button variant="primary" size="medium">Submit Survey</lit-button>
      </div>
      </div>
    </lit-mobile-viewport>
  `,
};

