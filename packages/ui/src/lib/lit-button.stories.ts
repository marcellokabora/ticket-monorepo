import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/Button',
  component: 'lit-button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'default', 'pillar-black', 'pillar-blue'],
      description: 'Button style variant (primary, secondary, tertiary, default, pillar-black, or pillar-blue)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    rounded: {
      control: 'select',
      options: ['full', 'sm', 'md', 'lg'],
      description: 'Border radius style',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    class: {
      control: 'text',
      description: 'CSS classes (supports Tailwind classes like w-full, max-w-md, etc.)',
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    rounded: 'full',
    disabled: false,
    loading: false,
    class: '',
  },
};

export default meta;
type Story = StoryObj;

// Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <lit-button
      variant="${args.variant}"
      size="${args.size}"
      ?disabled="${args.disabled}"
      ?loading="${args.loading}"
      class="${args.class}"
    >
      <span>Credit Card</span>
      <lit-icon name="menu"></lit-icon>
    </lit-button>
  `,
};

// All button variations
export const AllVariations: Story = {
  render: () => html`
    <div class="flex flex-col gap-8 p-5 font-sans">

      <!-- Default Buttons (Plain/Ghost) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Default Buttons</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button size="small">Menu</lit-button>
          <lit-button size="medium">Menu</lit-button>
          <lit-button size="large">Menu</lit-button>
          <lit-button size="small" disabled>Disabled</lit-button>
        </div>
      </div>
    
      <!-- White Context (Page Background) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Primary Buttons</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="primary" size="small">Menu</lit-button>
          <lit-button variant="primary" size="medium">Menu</lit-button>
          <lit-button variant="primary" size="large">Menu</lit-button>
          <lit-button variant="primary" size="small" disabled>Disabled</lit-button>
        </div>
      </div>

      <!-- Light Context (Gray Header) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Secondary Buttons (Light Background)</h3>
        <div class="bg-secondary-20 p-5 rounded-lg flex gap-3 flex-wrap items-center text-secondary-800">
          <lit-button variant="secondary" size="small">Menu</lit-button>
          <lit-button variant="secondary" size="medium">Menu</lit-button>
          <lit-button variant="secondary" size="large">Menu</lit-button>
          <lit-button variant="secondary" size="small" disabled>Disabled</lit-button>
        </div>
      </div>

      <!-- Dark Context (Green Header) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Secondary Buttons (Dark Background)</h3>
        <div class="bg-primary-800 p-5 rounded-lg flex gap-3 flex-wrap items-center text-white">
          <lit-button variant="secondary" size="small">Menu</lit-button>
          <lit-button variant="secondary" size="medium">Menu</lit-button>
          <lit-button variant="secondary" size="large">Menu</lit-button>
          <lit-button variant="secondary" size="small" disabled>Disabled</lit-button>
        </div>
      </div>

      <!-- Tertiary Buttons (White with Blue Border) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Tertiary Buttons</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="tertiary" size="small">
            Menu
          </lit-button>
          <lit-button variant="tertiary" size="medium">
            Menu
          </lit-button>
          <lit-button variant="tertiary" size="large">
            Menu
          </lit-button>
          <lit-button variant="tertiary" size="small" disabled>
            Menu
          </lit-button>
        </div>
      </div>

      <!-- Pillar Black Buttons (Dark Background) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Pillar Black Buttons</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="pillar-black" size="small">
            Menu
          </lit-button>
          <lit-button variant="pillar-black" size="medium">
            Menu
          </lit-button>
          <lit-button variant="pillar-black" size="large">
            Menu
          </lit-button>
          <lit-button variant="pillar-black" size="small" disabled>
            Menu
          </lit-button>
        </div>
      </div>

      <!-- Pillar Blue Buttons (Light Blue Background) -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Pillar Blue Buttons</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="pillar-blue" size="small">
            Menu
          </lit-button>
          <lit-button variant="pillar-blue" size="medium">
            Menu
          </lit-button>
          <lit-button variant="pillar-blue" size="large">
            Menu
          </lit-button>
          <lit-button variant="pillar-blue" size="small" disabled>
            Menu
          </lit-button>
        </div>
      </div>

    </div>
  `,
};

// Icon variations
export const WithIcons: Story = {
  render: () => html`
    <div class="flex flex-col gap-8 p-5 font-sans">
      
      <!-- Buttons with Icons and Text -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Buttons with Icons and Text - All Variants</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="primary" size="medium">
            <lit-icon icon="mdi:arrow-left"></lit-icon>
            <span>Primary</span>
          </lit-button>
          <lit-button variant="secondary" size="medium">
            <lit-icon icon="mdi:arrow-left"></lit-icon>
            <span>Secondary</span>
          </lit-button>
          <lit-button variant="tertiary" size="medium">
            <lit-icon icon="mdi:arrow-left"></lit-icon>
            <span>Tertiary</span>
          </lit-button>
          <lit-button variant="default" size="medium">
            <lit-icon icon="mdi:arrow-left"></lit-icon>
            <span>Default</span>
          </lit-button>
          <lit-button variant="pillar-black" size="medium">
            <lit-icon icon="mdi:arrow-left"></lit-icon>
            <span>Pillar Black</span>
          </lit-button>
          <lit-button variant="pillar-blue" size="medium">
            <lit-icon icon="mdi:arrow-left"></lit-icon>
            <span>Pillar Blue</span>
          </lit-button>
        </div>
      </div>

      <!-- Icon-Only Buttons -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Icon-Only Buttons - All Variants</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="primary" size="medium" icon-only title="Primary">
            <lit-icon icon="mdi:plus"></lit-icon>
          </lit-button>
          <lit-button variant="secondary" size="medium" icon-only title="Secondary">
            <lit-icon icon="mdi:close"></lit-icon>
          </lit-button>
          <lit-button variant="tertiary" size="medium" icon-only title="Tertiary">
            <lit-icon icon="mdi:magnify"></lit-icon>
          </lit-button>
          <lit-button variant="default" size="medium" icon-only title="Default">
            <lit-icon icon="mdi:dots-vertical"></lit-icon>
          </lit-button>
          <lit-button variant="pillar-black" size="medium" icon-only title="Pillar Black">
            <lit-icon icon="mdi:pencil"></lit-icon>
          </lit-button>
          <lit-button variant="pillar-blue" size="medium" icon-only title="Pillar Blue">
            <lit-icon icon="mdi:delete"></lit-icon>
          </lit-button>
        </div>
      </div>

      <!-- Icon-Only Buttons - Different Sizes -->
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Icon-Only Sizes</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button variant="primary" size="small" icon-only>
            <lit-icon icon="mdi:close"></lit-icon>
          </lit-button>
          <lit-button variant="primary" size="medium" icon-only>
            <lit-icon icon="mdi:close"></lit-icon>
          </lit-button>
          <lit-button variant="primary" size="large" icon-only>
            <lit-icon icon="mdi:close"></lit-icon>
          </lit-button>
        </div>
      </div>

    </div>
  `,
};

// Width Examples
export const FullWidthButtons: Story = {
  render: () => html`
    <div class="flex flex-col gap-3 p-5 font-sans max-w-md">
      <h3 class="m-0 mb-3 text-neutral-black">Full Width / Max Width (480px)</h3>
      <lit-button variant="primary" size="large" class="w-full max-w-[480px]">
        <span>Next</span>
        <lit-icon icon="mdi:arrow-right"></lit-icon>
      </lit-button>
      <lit-button variant="primary" size="large" class="w-full max-w-[480px]">
        <lit-icon icon="mdi:arrow-left"></lit-icon>
        <span>Back</span>
      </lit-button>
      <lit-button variant="primary" size="large" class="w-full max-w-[480px]">
        Continue
      </lit-button>
      <lit-button variant="secondary" size="medium" class="w-full max-w-[480px]">
        Cancel
      </lit-button>
    </div>
  `,
};

// Loading State Example
export const LoadingState: Story = {
  render: () => html`
    <div class="flex gap-3 p-5 font-sans flex-wrap items-center">
      <lit-button variant="primary" size="medium" loading>
        Processing
      </lit-button>
      <lit-button variant="secondary" size="medium" loading>
        Loading...
      </lit-button>
      <lit-button size="medium" loading>
        Please Wait
      </lit-button>
    </div>
  `,
};

// Click Event Example
export const ClickEvent: Story = {
  render: () => {
    const handleClick = (e: Event) => {
      const button = e.currentTarget as unknown as { loading: boolean };
      button.loading = true;
      setTimeout(() => {
        alert('Button clicked!');
        button.loading = false;
      }, 0);
    };

    return html`
      <div class="flex flex-col gap-4 p-5 font-sans">
        <h3 class="m-0 mb-3 text-neutral-black">Click Event Handling</h3>
        <div class="flex gap-3 flex-wrap">
          <lit-button 
            variant="primary" 
            size="medium"
            @click=${handleClick}
          >
            Click Me!
          </lit-button>
          <lit-button 
            variant="secondary" 
            size="medium"
            @click=${handleClick}
          >
            Click Me!
          </lit-button>
        </div>
      </div>
    `;
  },
};

export const TailwindColors: Story = {
  render: () => html`
    <div class="flex flex-col gap-8 p-5 font-sans">
      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Text Buttons with Tailwind Background Colors</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button size="medium" class="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
            Blue
          </lit-button>
          <lit-button size="medium" class="bg-red-600 hover:bg-red-700 text-white rounded-full">
            Red
          </lit-button>
          <lit-button size="medium" class="bg-green-600 hover:bg-green-700 text-white rounded-full">
            Green
          </lit-button>
          <lit-button size="medium" class="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
            Purple
          </lit-button>
          <lit-button size="medium" class="bg-orange-600 hover:bg-orange-700 text-white rounded-full">
            Orange
          </lit-button>
          <lit-button size="medium" class="bg-pink-600 hover:bg-pink-700 text-white rounded-full">
            Pink
          </lit-button>
          <lit-button size="medium" class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
            Indigo
          </lit-button>
        </div>
      </div>

      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Text Buttons with Border & Text Colors</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button size="medium" class="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full">
            Blue
          </lit-button>
          <lit-button size="medium" class="border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-full">
            Red
          </lit-button>
          <lit-button size="medium" class="border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full">
            Green
          </lit-button>
          <lit-button size="medium" class="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 rounded-full">
            Purple
          </lit-button>
          <lit-button size="medium" class="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-full">
            Orange
          </lit-button>
        </div>
      </div>

      <div>
        <h3 class="m-0 mb-3 text-neutral-black">Text Buttons with Text Colors Only</h3>
        <div class="bg-white p-5 rounded-lg border border-neutral-200 flex gap-3 flex-wrap items-center">
          <lit-button size="medium" class="text-blue-600 hover:text-blue-700">
            Blue Text
          </lit-button>
          <lit-button size="medium" class="text-red-600 hover:text-red-700">
            Red Text
          </lit-button>
          <lit-button size="medium" class="text-green-600 hover:text-green-700">
            Green Text
          </lit-button>
          <lit-button size="medium" class="text-purple-600 hover:text-purple-700">
            Purple Text
          </lit-button>
        </div>
      </div>

    </div>
  `,
};
