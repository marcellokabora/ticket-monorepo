import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-checkbox';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';
import './lit-text-field';

const meta: Meta = {
  title: 'Design System/Checkbox',
  component: 'lit-checkbox',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
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
    label: '',
    name: 'checkbox',
    value: 'checkbox-value',
  },
};

export default meta;
type Story = StoryObj;

/**
 * Interactive playground to test all checkbox properties
 */
export const Playground: Story = {
  render: (args) => html`
    <lit-checkbox
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      label=${args.label}
      name=${args.name}
      value=${args.value}
      @checkbox-change=${(e: CustomEvent) => {
      console.log('Checkbox changed:', e.detail);
    }}
    ></lit-checkbox>
  `,
};

/**
 * All checkbox states (📱 Mobile viewport)
 */
export const AllStates: Story = {
  render: () => html`
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Unchecked</h3>
          <lit-checkbox label="Unchecked"></lit-checkbox>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Checked</h3>
          <lit-checkbox checked label="Checked"></lit-checkbox>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Disabled (Unchecked)</h3>
          <lit-checkbox disabled label="Disabled"></lit-checkbox>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Disabled (Checked)</h3>
          <lit-checkbox disabled checked label="Disabled & Checked"></lit-checkbox>
        </div>
      </div>
  `,
};

/**
 * Real-world usage examples in context (📱 Mobile viewport)
 */
export const InContext: Story = {
  render: () => html`
    <lit-mobile-viewport width="small" background="white">
      <div class="flex flex-col h-full p-6">
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-4">Task Manager</h2>
          
          <!-- Add Task Section -->
          <div class="flex gap-2 mb-6 items-end">
            <div class="flex-1">
              <lit-text-field 
                label="New Task" 
                placeholder="What needs to be done?"
              ></lit-text-field>
            </div>
          </div>

          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Today's Tasks</h3>
          
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <lit-checkbox checked label="Design mockups"></lit-checkbox>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <lit-checkbox checked label="Review requirements"></lit-checkbox>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
              <lit-checkbox label="Implement component"></lit-checkbox>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
              <lit-checkbox label="Write tests"></lit-checkbox>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
              <lit-checkbox label="Deploy"></lit-checkbox>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span class="text-xs text-gray-500">3 items left</span>
          <lit-button variant="secondary" size="small">Clear completed</lit-button>
        </div>
      </div>
    </lit-mobile-viewport>
  `,
};

