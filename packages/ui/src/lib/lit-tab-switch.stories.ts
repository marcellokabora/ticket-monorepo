import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-tab-switch';
import './lit-text-field';
import './lit-icon';
import './lit-mobile-viewport';
import './lit-checkbox';
import './lit-button';

const meta: Meta = {
  title: 'Design System/TabSwitch',
  component: 'lit-tab-switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: [0, 1],
      description: 'The currently active tab (0 or 1)',
    },
    label1: {
      control: 'text',
      description: 'Label for the first tab',
    },
    label2: {
      control: 'text',
      description: 'Label for the second tab',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tab switch is disabled',
    },
  },
  args: {
    activeTab: 0,
    label1: 'Email',
    label2: 'SMS',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default tab switch with Email/SMS labels.
 * The first tab is active by default.
 */
export const Default: Story = {
  args: {
    activeTab: 0,
    label1: 'Email',
    label2: 'SMS',
  },
  render: (args) => html`
    <lit-tab-switch
      .activeTab=${args.activeTab}
      .label1=${args.label1}
      .label2=${args.label2}
      ?disabled=${args.disabled}
      @tab-change=${(e: CustomEvent) => {
      console.log('Tab changed:', e.detail);
    }}
    ></lit-tab-switch>
  `,
};

/**
 * Tab switch with second tab active.
 */
export const SecondTabActive: Story = {
  args: {
    activeTab: 1,
    label1: 'Email',
    label2: 'SMS',
  },
  render: (args) => html`
    <lit-tab-switch
      .activeTab=${args.activeTab}
      .label1=${args.label1}
      .label2=${args.label2}
      ?disabled=${args.disabled}
    ></lit-tab-switch>
  `,
};

/**
 * Disabled tab switch.
 * User cannot interact with a disabled tab switch.
 */
export const Disabled: Story = {
  args: {
    activeTab: 0,
    label1: 'Email',
    label2: 'SMS',
    disabled: true,
  },
  render: (args) => html`
    <lit-tab-switch
      .activeTab=${args.activeTab}
      .label1=${args.label1}
      .label2=${args.label2}
      ?disabled=${args.disabled}
    ></lit-tab-switch>
  `,
};

/**
 * Custom labels for different use cases.
 */
export const CustomLabels: Story = {
  args: {
    activeTab: 0,
    label1: 'Monthly',
    label2: 'Yearly',
  },
  render: (args) => html`
    <lit-tab-switch
      .activeTab=${args.activeTab}
      .label1=${args.label1}
      .label2=${args.label2}
      ?disabled=${args.disabled}
    ></lit-tab-switch>
  `,
};

/**
 * Interactive example with event handling.
 */
export const Interactive: Story = {
  args: {
    activeTab: 0,
    label1: 'Option A',
    label2: 'Option B',
  },
  render: (args) => html`
    <div class="flex flex-col gap-4 items-center">
      <lit-tab-switch
        .activeTab=${args.activeTab}
        .label1=${args.label1}
        .label2=${args.label2}
        ?disabled=${args.disabled}
        @tab-change=${(e: CustomEvent) => {
      const output = document.getElementById('output');
      if (output) {
        output.textContent = `Selected: ${e.detail.label} (Tab ${e.detail.activeTab})`;
      }
    }}
      ></lit-tab-switch>
      <div id="output" class="font-['Lato',sans-serif] text-neutral-black">
        Selected: ${args.label1} (Tab 0)
      </div>
    </div>
  `,
};

/**
 * Tab switch with context - showing real-world usage with form inputs (📱 Mobile viewport)
 * This example demonstrates Email vs SMS input fields that change based on tab selection.
 * 
 * @see #file:lit-mobile-viewport.ts
 */
export const WithInputContext: Story = {
  args: {
    activeTab: 0,
    label1: 'Email',
    label2: 'SMS',
  },
  render: (args) => html`
    <lit-mobile-viewport width="small" background="gray" .padding=${false}>
      <div class="flex justify-center px-4 pt-4">
        <lit-tab-switch
          .activeTab=${args.activeTab}
          .label1=${args.label1}
          .label2=${args.label2}
          ?disabled=${args.disabled}
        @tab-change=${(e: CustomEvent) => {
      const emailInput = document.getElementById('email-input-context');
      const smsInput = document.getElementById('sms-input-context');
      if (e.detail.activeTab === 0) {
        if (emailInput) emailInput.classList.remove('hidden');
        if (smsInput) smsInput.classList.add('hidden');
      } else {
        if (emailInput) emailInput.classList.add('hidden');
        if (smsInput) smsInput.classList.remove('hidden');
      }
    }}
      ></lit-tab-switch>
      </div>
      
      <div class="px-4 pt-6 pb-8 flex flex-col gap-6">
        <!-- Header -->
        <div>
          <h2 class="text-xl font-bold text-neutral-black mb-2">Verify your identity</h2>
          <p class="text-sm text-gray-600">Choose how you'd like to receive your verification code</p>
        </div>

        <!-- Email Form -->
        <div id="email-input-context" class="w-full flex flex-col gap-4 ${args.activeTab === 0 ? '' : 'hidden'}">
          <lit-text-field
            label="Email Address"
            placeholder="your@email.com"
            inputType="email"
            hint="We'll send a 6-digit code to this email"
          ></lit-text-field>
          
          <lit-checkbox label="Remember this device for 30 days"></lit-checkbox>
        </div>

        <!-- SMS Form -->
        <div id="sms-input-context" class="w-full flex flex-col gap-4 ${args.activeTab === 1 ? '' : 'hidden'}">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div class="flex gap-3">
              <!-- Country Code Selector -->
              <div class="flex items-center gap-1 h-[54px] px-2 pl-4 bg-white rounded-lg cursor-pointer border border-secondary-200">
                <lit-icon icon="circle-flags:es" size="22px"></lit-icon>
                <lit-icon name="chevron-down" size="24px" class="text-neutral-black"></lit-icon>
              </div>

              <!-- Phone Number Input -->
              <lit-text-field
                type="phone-number"
                prefix="+34"
                placeholder="600 123 456"
                class="flex-1"
              ></lit-text-field>
            </div>
            <p class="text-xs text-gray-500 mt-2">Standard SMS rates may apply</p>
          </div>
          
          <lit-checkbox label="Remember this device for 30 days"></lit-checkbox>
        </div>

        <!-- Action Button -->
        <lit-button variant="primary" class="w-full mt-2">
          Send verification code
        </lit-button>

        <!-- Help Link -->
        <p class="text-center text-sm text-gray-600">
          Having trouble? <a href="#" class="text-primary-500 font-medium">Contact support</a>
        </p>
      </div>
    </lit-mobile-viewport>
  `,
};

