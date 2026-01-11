import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-colors';
import './lit-button';

const meta: Meta = {
  title: 'Design System/Colors',
  component: 'lit-colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

/**
 * Complete color palette showing all available colors organized by category.
 * Each color swatch displays the color name, hex value, RGB values, and CSS variable name.
 */
export const AllColors: Story = {
  render: () => html`
    <lit-colors></lit-colors>
  `,
};

/**
 * Examples showing how to use colors with actual components.
 */
export const UsageExamples: Story = {
  render: () => html`
    <div class="p-6 font-sans">
      <h2 class="text-2xl font-bold mb-6 text-neutral-black">
        Usage Examples
      </h2>
      
      <div class="flex flex-col gap-8">
        <!-- Primary Button -->
        <div>
          <h3 class="text-base font-semibold mb-3 text-neutral-black">Primary Button</h3>
          <lit-button variant="primary" size="medium">Click Me</lit-button>
          <code class="block mt-2 text-[11px] text-neutral-500 font-mono">
            background-color: var(--color-primary-300)
          </code>
        </div>

        <!-- Secondary Button -->
        <div>
          <h3 class="text-base font-semibold mb-3 text-neutral-black">Secondary Button</h3>
          <lit-button variant="secondary" size="medium">Learn More</lit-button>
          <code class="block mt-2 text-[11px] text-neutral-500 font-mono">
            border-color: var(--color-primary-300)
          </code>
        </div>

        <!-- Button States -->
        <div>
          <h3 class="text-base font-semibold mb-3 text-neutral-black">Button States</h3>
          <div class="flex gap-3 items-center">
            <lit-button variant="primary" size="medium">Default</lit-button>
            <lit-button variant="primary" size="medium" disabled>Disabled</lit-button>
            <lit-button variant="secondary" size="medium">Outlined</lit-button>
          </div>
          <code class="block mt-2 text-[11px] text-neutral-500 font-mono">
            Uses primary-300 (rest), primary-400 (hover), primary-500 (active)
          </code>
        </div>

        <!-- Card with neutral colors -->
        <div>
          <h3 class="text-base font-semibold mb-3 text-neutral-black">Card Component</h3>
          <div class="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
            <h4 class="text-neutral-black m-0 mb-2 text-lg font-semibold">Card Title</h4>
            <p class="text-neutral-500 m-0 mb-4 text-sm">This is a card component using neutral colors for the background and border.</p>
            <lit-button variant="primary" size="medium">Take Action</lit-button>
          </div>
          <code class="block mt-2 text-[11px] text-neutral-500 font-mono">
            background: var(--color-neutral-white); border: var(--color-neutral-200)
          </code>
        </div>
      </div>
    </div>
  `,
};
