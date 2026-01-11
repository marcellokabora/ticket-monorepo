import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-text-field';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/TextField',
  component: 'lit-text-field',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['basic', 'phone-number', 'pin-number'],
      description: 'Input type (basic text field, phone number, or PIN/verification code)',
    },
    label: {
      control: 'text',
      description: 'Label text displayed in the field',
    },
    value: {
      control: 'text',
      description: 'Current input value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in rest state',
    },
    prefix: {
      control: 'text',
      description: 'Phone number prefix (for phone-number type)',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the field',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    validated: {
      control: 'boolean',
      description: 'Whether to show validation success icon',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
  },
  args: {
    type: 'basic',
    label: 'Label',
    value: '',
    placeholder: '',
    prefix: '+34',
    error: 'Validation message',
    disabled: false,
    validated: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

// Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <lit-text-field
      type="${args.type}"
      label="${args.label}"
      value="${args.value}"
      placeholder="${args.placeholder}"
      prefix="${args.prefix}"
      error="${args.error}"
      ?disabled="${args.disabled}"
      ?validated="${args.validated}"
      ?required="${args.required}"
    ></lit-text-field>
  `,
};

// All states for basic type (📱 Mobile viewport)
export const BasicTypeAllStates: Story = {
  render: () => html`      
      <div class="flex flex-col gap-6">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Rest (Tap to type)</h3>
          <lit-text-field 
            label="Email"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Focused (Tap field)</h3>
          <lit-text-field 
            label="Email"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">With value</h3>
          <lit-text-field 
            label="Email"
            value="user@example.com"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Validated</h3>
          <lit-text-field 
            label="Email"
            value="user@example.com"
            validated
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Error</h3>
          <lit-text-field 
            label="Email"
            value="invalid-email"
            error
            error="Please enter a valid email"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Disabled</h3>
          <lit-text-field 
            label="Label"
            disabled
          ></lit-text-field>
        </div>
      </div>
  `,
};

// All states for phone number type (📱 Mobile viewport)
export const PhoneNumberTypeAllStates: Story = {
  render: () => html`
      
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Empty (Tap to enter)</h3>
          <lit-text-field 
            type="phone-number"
            prefix="+34"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">With value</h3>
          <lit-text-field 
            type="phone-number"
            prefix="+34"
            value="555 555 555"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Validated</h3>
          <lit-text-field 
            type="phone-number"
            prefix="+34"
            value="555 555 555"
            validated
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Error</h3>
          <lit-text-field 
            type="phone-number"
            prefix="+34"
            value="123"
            error
            error="Invalid phone number"
          ></lit-text-field>
        </div>
      </div>
  `,
};

// All states for PIN number type (📱 Mobile viewport)
export const PinNumberTypeAllStates: Story = {
  render: () => html`
      
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Empty (Tap to enter)</h3>
          <lit-text-field 
            type="pin-number"
            placeholder="– – – –"
            maxlength="4"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Partial value (2 digits)</h3>
          <lit-text-field 
            type="pin-number"
            placeholder="– – – –"
            value="12"
            maxlength="4"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Complete value</h3>
          <lit-text-field 
            type="pin-number"
            placeholder="– – – –"
            value="1234"
            maxlength="4"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Validated (4 digits)</h3>
          <lit-text-field 
            type="pin-number"
            placeholder="– – – –"
            value="1234"
            maxlength="4"
            validated
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Error</h3>
          <lit-text-field 
            type="pin-number"
            placeholder="– – – –"
            value="123"
            maxlength="4"
            error
            error="Code must be 4 digits"
          ></lit-text-field>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">6-digit PIN</h3>
          <lit-text-field 
            type="pin-number"
            placeholder="– – – – – –"
            value="123456"
            maxlength="6"
            validated
          ></lit-text-field>
        </div>
      </div>
  `,
};



// Different input types (📱 Mobile viewport)
export const InputTypes: Story = {
  render: () => html`
      <div class="flex flex-col gap-3">
        <lit-text-field 
          label="Text"
          inputType="text"
        ></lit-text-field>

        <lit-text-field 
          label="Email"
          inputType="email"
        ></lit-text-field>

        <lit-text-field 
          label="Password"
          inputType="password"
        ></lit-text-field>

        <lit-text-field 
          label="Telephone"
          inputType="tel"
        ></lit-text-field>

        <lit-text-field 
          label="URL"
          inputType="url"
        ></lit-text-field>
      </div>
  `,
};

// Real-world form context (📱 Mobile viewport)
export const InContext: Story = {
  render: () => html`
    <lit-mobile-viewport width="small" background="white">
      <div class="p-6">
        <h1 class="text-xl font-bold mb-2">Verify Your Identity</h1>
        <p class="text-gray-500 text-sm mb-5">Enter your details and verification code</p>
        
        <form class="flex flex-col gap-4">
          <!-- Contact Information -->
          <div class="flex flex-col gap-3">
            <h2 class="text-base font-semibold">Contact Info</h2>
            
            <lit-text-field 
              label="Email"
              inputType="email"
              value="user@example.com"
              validated
              required
            ></lit-text-field>

            <lit-text-field 
              type="phone-number"
              prefix="+34"
              value="555 555 555"
              validated
            ></lit-text-field>
          </div>

          <!-- Verification Code -->
          <div class="flex flex-col gap-3 pt-3 border-t border-gray-200">
            <h2 class="text-base font-semibold text-center">Enter Verification Code</h2>
            <p class="text-sm text-gray-500 text-center mb-2">We sent a code to your phone</p>
            
            <lit-text-field 
              type="pin-number"
              placeholder="– – – –"
              maxlength="4"
            ></lit-text-field>
          </div>
        </form>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-row gap-2 p-4" slot="footer">
        <lit-button variant="secondary" size="medium">
          Resend
        </lit-button>
        <lit-button variant="primary" size="medium" class="w-full">
          Verify
        </lit-button>
      </div>
    </lit-mobile-viewport>
  `,
};