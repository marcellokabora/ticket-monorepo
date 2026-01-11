import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-toggle';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/Toggle',
  component: 'lit-toggle',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center all stories by default
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked/selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submissions',
    },
    value: {
      control: 'text',
      description: 'Value attribute for form submissions',
    },
  },
  args: {
    checked: false,
    disabled: false,
    name: '',
    value: '',
  },
};

export default meta;
type Story = StoryObj;

// Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <lit-toggle
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      name="${args.name}"
      value="${args.value}"
      @toggle-change="${(e: CustomEvent) => {
      console.log('Toggle changed:', e.detail.checked);
    }}"
    ></lit-toggle>
  `,
};


// All toggle states (📱 Mobile viewport)
export const AllStates: Story = {
  render: () => html`
      
      <div class="flex flex-col gap-4">
        <!-- Rest State -->
        <div>
          <h3 class="text-sm font-semibold mb-2">Rest (Off)</h3>
          <div class="flex items-center gap-3">
            <lit-toggle></lit-toggle>
            <span class="text-gray-500 text-sm">Tap to turn on</span>
          </div>
        </div>

        <!-- Selected State -->
        <div>
          <h3 class="text-sm font-semibold mb-2">Selected (On)</h3>
          <div class="flex items-center gap-3">
            <lit-toggle checked></lit-toggle>
            <span class="text-gray-500 text-sm">Active state</span>
          </div>
        </div>

        <!-- Disabled State (Unchecked) -->
        <div>
          <h3 class="text-sm font-semibold mb-2">Disabled (Off)</h3>
          <div class="flex items-center gap-3">
            <lit-toggle disabled></lit-toggle>
            <span class="text-gray-500 text-sm">Not available</span>
          </div>
        </div>

        <!-- Disabled State (Checked) -->
        <div>
          <h3 class="text-sm font-semibold mb-2">Disabled (On)</h3>
          <div class="flex items-center gap-3">
            <lit-toggle checked disabled></lit-toggle>
            <span class="text-gray-500 text-sm">Not available</span>
          </div>
        </div>
      </div>
  `,
};

// Component composition with other lit-components (📱 Mobile viewport)
export const InContext: Story = {
  render: () => html`
    <lit-mobile-viewport width="small" background="white">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Mobile Settings</h2>
        
        <div class="flex flex-col gap-3 mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <lit-icon icon="mdi:wifi" size="20px"></lit-icon>
              <div>
                <div class="text-sm font-semibold">Wi-Fi</div>
                <div class="text-xs text-gray-500">Connected</div>
              </div>
            </div>
            <lit-toggle checked></lit-toggle>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <lit-icon icon="mdi:bluetooth" size="20px"></lit-icon>
              <div>
                <div class="text-sm font-semibold">Bluetooth</div>
                <div class="text-xs text-gray-500">2 devices</div>
              </div>
            </div>
            <lit-toggle checked></lit-toggle>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <lit-icon icon="mdi:airplane" size="20px"></lit-icon>
              <div>
                <div class="text-sm font-semibold">Airplane</div>
                <div class="text-xs text-gray-500">Off</div>
              </div>
            </div>
            <lit-toggle></lit-toggle>
          </div>
        </div>

        <div class="flex gap-2">
          <lit-button variant="secondary" size="medium" class="flex-1">Reset</lit-button>
          <lit-button variant="primary" size="medium" class="flex-1">Save</lit-button>
        </div>
      </div>
    </lit-mobile-viewport>
  `,
};

