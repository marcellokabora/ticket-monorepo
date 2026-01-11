import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-dialog';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/Dialog',
  component: 'lit-dialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open or closed',
    },
    hideClose: {
      control: 'boolean',
      description: 'Whether to hide the close button',
    },
  },
  args: {
    open: true,
    hideClose: false,
  },
};

export default meta;
type Story = StoryObj;

/**
 * Full view of the dialog component - always open to see the complete design.
 * Use the controls to customize properties.
 */
export const Playground: Story = {
  render: (args) => {
    const openDialog = () => {
      const dialog = document.getElementById('playground-dialog') as HTMLElement & { open: boolean };
      if (dialog) {
        dialog.open = true;
      }
    };

    const closeDialog = () => {
      const dialog = document.getElementById('playground-dialog') as HTMLElement & { open: boolean };
      if (dialog) {
        dialog.open = false;
      }
    };

    return html`
      <div class="h-screen bg-secondary-20">
        <div class="flex items-center justify-center h-screen">
          <lit-button variant="primary" size="medium" @click=${openDialog}>
            <span>Open Dialog</span>
          </lit-button>
        </div>

        <lit-dialog
          id="playground-dialog"
          ?open=${args.open}
          ?hide-close=${args.hideClose}
        >
          <div class="flex flex-col gap-6 p-6">
            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-bold text-neutral-black">Delete email</h2>
              <p class="text-base text-secondary-300">
                Removing this promo code will cancel the discount and it can't be recovered.
              </p>
            </div>
            <div class="flex gap-5 w-full">
              <lit-button variant="secondary" size="medium" class="flex-1" @click=${closeDialog}>
                <span>Don't delete</span>
              </lit-button>
              <lit-button variant="primary" size="medium" class="flex-1" @click=${closeDialog}>
                <span>Delete</span>
              </lit-button>
            </div>
          </div>
        </lit-dialog>
      </div>
    `;
  },
};
