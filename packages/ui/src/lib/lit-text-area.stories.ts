import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-text-area';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/TextArea',
  component: 'lit-text-area',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed in the field',
    },
    value: {
      control: 'text',
      description: 'Current textarea value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    validated: {
      control: 'boolean',
      description: 'Whether to show validated state',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    showPasteButton: {
      control: 'boolean',
      description: 'Whether to show the paste button',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines',
    },
    maxlength: {
      control: 'number',
      description: 'Maximum input length',
    },
  },
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    disabled: false,
    validated: false,
    required: false,
    showPasteButton: false,
    rows: 4,
  },
};

export default meta;
type Story = StoryObj;

// 1. Interactive playground
export const Playground: Story = {
  render: (args) =>
    html`
      <div style="width: 375px;">
        <lit-text-area
          label="${args.label}"
          value="${args.value || ''}"
          placeholder="${args.placeholder}"
          error="${args.error || ''}"
          ?disabled="${args.disabled}"
          ?validated="${args.validated}"
          ?required="${args.required}"
          ?showPasteButton="${args.showPasteButton}"
          rows="${args.rows}"
          maxlength="${args.maxlength || ''}"
        ></lit-text-area>
      </div>
    `,
};

// 2. All variations
export const AllVariations: Story = {
  render: () => html`
    <div class="flex flex-col gap-8" style="width: 375px;">
      <!-- Rest state -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">Rest State</h4>
        <lit-text-area
          label="Comments"
          placeholder="Enter your comments"
        ></lit-text-area>
      </div>

      <!-- With value -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">With Value</h4>
        <lit-text-area
          label="Description"
          value="This is a sample description that demonstrates the textarea component with actual content entered by the user."
        ></lit-text-area>
      </div>

      <!-- With paste button -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">With Paste Button</h4>
        <lit-text-area
          label="Label with external paste"
          showPasteButton
        ></lit-text-area>
      </div>

      <!-- Validated state -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">Validated</h4>
        <lit-text-area
          label="Message"
          value="Thank you for your feedback!"
          validated
        ></lit-text-area>
      </div>

      <!-- Error state -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">Error State</h4>
        <lit-text-area
          label="Description"
          value="Too short"
          error="Description must be at least 10 characters"
        ></lit-text-area>
      </div>

      <!-- Disabled state -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">Disabled</h4>
        <lit-text-area
          label="Comments"
          value="This field is disabled and cannot be edited."
          disabled
        ></lit-text-area>
      </div>

      <!-- With maxlength -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">With Max Length (100)</h4>
        <lit-text-area
          label="Short message"
          placeholder="Maximum 100 characters"
          maxlength="100"
        ></lit-text-area>
      </div>

      <!-- More rows -->
      <div>
        <h4 class="text-sm font-semibold mb-2 text-neutral-500">Extended (8 rows)</h4>
        <lit-text-area
          label="Long message"
          placeholder="Enter a longer message"
          rows="8"
        ></lit-text-area>
      </div>
    </div>
  `,
};

// 3. In Context - Show component with other lit-components AND event handling
export const InContext: Story = {
  render: () => {
    const handleInput = (e: CustomEvent) => {
      console.log('Textarea input:', e.detail);
    };

    const handlePaste = (e: CustomEvent) => {
      console.log('Paste clicked:', e.detail);
      alert('Content pasted from clipboard!');
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const feedback = formData.get('feedback');
      alert(`Feedback submitted:\n${feedback}`);
    };

    return html`
      <lit-mobile-viewport width="small" background="white">
        <div class="flex flex-col gap-4 p-6">
          <!-- Feedback Form -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
              <lit-icon icon="mdi:message-text-outline"></lit-icon>
              <span>Send Feedback</span>
            </h3>
            <p class="text-sm text-neutral-300 mb-4">
              We'd love to hear your thoughts about our service.
            </p>

            <form @submit=${handleSubmit}>
              <lit-text-area
                name="feedback"
                label="Your Feedback"
                placeholder="Share your experience..."
                required
                rows="6"
                @input=${handleInput}
              ></lit-text-area>

              <div class="flex gap-3 mt-4">
                <lit-button variant="secondary" size="medium" type="button">
                  <span>Cancel</span>
                </lit-button>
                <lit-button variant="primary" size="medium" type="submit">
                  <span>Submit Feedback</span>
                  <lit-icon icon="mdi:send"></lit-icon>
                </lit-button>
              </div>
            </form>
          </div>

          <!-- Paste from External Source -->
          <div class="border-t border-secondary-80 pt-4">
            <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
              <lit-icon icon="mdi:content-paste"></lit-icon>
              <span>Paste Content</span>
            </h3>
            <p class="text-sm text-neutral-300 mb-4">
              Paste content from your clipboard using the button.
            </p>

            <lit-text-area
              label="Label with external paste"
              showPasteButton
              rows="5"
              @paste-click=${handlePaste}
              @input=${handleInput}
            ></lit-text-area>
          </div>

          <!-- Notes with validation -->
          <div class="border-t border-secondary-80 pt-4">
            <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
              <lit-icon icon="mdi:note-text-outline"></lit-icon>
              <span>Additional Notes</span>
            </h3>

            <lit-text-area
              label="Notes"
              value="Meeting notes: Discussed project timeline and deliverables."
              validated
              rows="4"
            ></lit-text-area>

            <p class="text-xs text-primary-700 mt-2 flex items-center gap-1">
              <lit-icon icon="mdi:check-circle" style="width: 16px; height: 16px;"></lit-icon>
              <span>Notes saved successfully</span>
            </p>
          </div>
        </div>
      </lit-mobile-viewport>
    `;
  },
};
