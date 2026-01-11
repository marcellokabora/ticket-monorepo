import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-icon';
import './lit-button';
import { getAvailableIcons } from './images/icons/icon-definitions.js';

const meta: Meta = {
  title: 'Design System/Icon',
  component: 'lit-icon',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Custom design system icon name (e.g., "tick", "search", "close")',
      table: {
        defaultValue: { summary: '' }
      }
    },
    icon: {
      control: 'text',
      description: 'Iconify icon name in format "collection:name" (e.g., "mdi:home")',
      table: {
        defaultValue: { summary: 'mdi:help' }
      }
    },
    size: {
      control: 'text',
      description: 'Icon size (e.g., "24px", "2em")',
      table: {
        defaultValue: { summary: '24px' }
      }
    },
    color: {
      control: 'color',
      description: 'Icon color',
      table: {
        defaultValue: { summary: 'currentColor' }
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    icon: 'mdi:home',
    size: '24px',
    color: 'currentColor'
  },
  render: (args) => html`
    <lit-icon
      icon=${args.icon}
      size=${args.size}
      color=${args.color}
    ></lit-icon>
  `
};

export const IconifyIcons: Story = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <div>
        <h4 class="text-sm font-medium mb-3 text-gray-700">Material Design Icons</h4>
        <div class="flex gap-4 items-center flex-wrap">
          <lit-icon icon="mdi:home" size="32px"></lit-icon>
          <lit-icon icon="mdi:account" size="32px"></lit-icon>
          <lit-icon icon="mdi:settings" size="32px"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px"></lit-icon>
          <lit-icon icon="mdi:star" size="32px"></lit-icon>
          <lit-icon icon="mdi:email" size="32px"></lit-icon>
          <lit-icon icon="mdi:phone" size="32px"></lit-icon>
          <lit-icon icon="mdi:calendar" size="32px"></lit-icon>
          <lit-icon icon="mdi:camera" size="32px"></lit-icon>
          <lit-icon icon="mdi:delete" size="32px"></lit-icon>
          <lit-icon icon="mdi:edit" size="32px"></lit-icon>
          <lit-icon icon="mdi:search" size="32px"></lit-icon>
          <lit-icon icon="mdi:menu" size="32px"></lit-icon>
          <lit-icon icon="mdi:close" size="32px"></lit-icon>
          <lit-icon icon="mdi:check" size="32px"></lit-icon>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-medium mb-3 text-gray-700">Country Flags</h4>
        <div class="flex gap-4 items-center flex-wrap">
          <lit-icon icon="circle-flags:us" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:gb" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:es" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:fr" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:de" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:it" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:jp" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:br" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:ca" size="32px"></lit-icon>
          <lit-icon icon="circle-flags:au" size="32px"></lit-icon>
        </div>
      </div>
    </div>
  `
};

export const SizesAndColors: Story = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <div>
        <h4 class="text-sm font-medium mb-3 text-gray-700">Sizes</h4>
        <div class="flex gap-4 items-center">
          <lit-icon icon="mdi:heart" size="16px"></lit-icon>
          <lit-icon icon="mdi:heart"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px"></lit-icon>
          <lit-icon icon="mdi:heart" size="48px"></lit-icon>
          <lit-icon icon="mdi:heart" size="64px"></lit-icon>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-medium mb-3 text-gray-700">Colors</h4>
        <div class="flex gap-4 items-center">
          <lit-icon icon="mdi:heart" size="32px" color="red"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px" color="blue"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px" color="green"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px" color="orange"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px" color="purple"></lit-icon>
          <lit-icon icon="mdi:heart" size="32px" color="#ff1493"></lit-icon>
        </div>
      </div>
    </div>
  `
};

export const WithButtons: Story = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <div>
        <h4 class="text-sm font-medium mb-3 text-gray-700">Icons with Text</h4>
        <div class="flex gap-4 items-center flex-wrap">
          <lit-button variant="secondary" size="small">
            <lit-icon icon="mdi:plus" size="20px"></lit-icon>
            <span>Add Item</span>
          </lit-button>
          <lit-button variant="secondary" size="small">
            <lit-icon icon="mdi:download" size="20px"></lit-icon>
            <span>Download</span>
          </lit-button>
          <lit-button variant="secondary" size="small">
            <lit-icon icon="mdi:delete" size="20px" color="red"></lit-icon>
            <span>Delete</span>
          </lit-button>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-medium mb-3 text-gray-700">Icon Only Buttons</h4>
        <div class="flex gap-2 items-center">
          <lit-button variant="secondary" icon-only>
            <lit-icon icon="mdi:heart"></lit-icon>
          </lit-button>
          <lit-button variant="secondary" icon-only>
            <lit-icon icon="mdi:share"></lit-icon>
          </lit-button>
          <lit-button variant="secondary" icon-only>
            <lit-icon icon="mdi:bookmark"></lit-icon>
          </lit-button>
          <lit-button variant="secondary" icon-only>
            <lit-icon icon="mdi:dots-vertical"></lit-icon>
          </lit-button>
        </div>
      </div>
    </div>
  `
};

export const AllCustomIcons: Story = {
  render: () => {
    const allIcons = getAvailableIcons();
    return html`
      <div>
        <h3 class="ml-4 mb-4 text-gray-800">
          All Custom Design System Icons
          <span class="ml-2 text-sm text-gray-600">(${allIcons.length} icons)</span>
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 w-full max-w-screen-xl mx-auto">
          ${allIcons.map(iconName => html`
            <div 
              class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-blue-600"
              title="${iconName}"
            >
              <lit-icon name="${iconName}" size="32px" color="#1976d2"></lit-icon>
              <span class="text-xs text-center text-gray-600 break-words">${iconName}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }
};


