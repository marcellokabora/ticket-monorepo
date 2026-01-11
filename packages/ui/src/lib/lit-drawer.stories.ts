import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-drawer';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';
import './lit-search-input';
import './lit-airport-select';

const meta: Meta = {
  title: 'Design System/Drawer',
  component: 'lit-drawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the drawer is open or closed',
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
 * Full view of the drawer component - always open to see the complete design.
 * Use the controls to customize properties.
 */
export const Playground: Story = {
  render: (args) => {
    const airports = [
      { name: 'John F. Kennedy International', code: 'JFK', country: 'United States' },
      { name: 'Heathrow Airport', code: 'LHR', country: 'United Kingdom' },
      { name: 'Charles de Gaulle Airport', code: 'CDG', country: 'France' },
      { name: 'Tokyo Haneda Airport', code: 'HND', country: 'Japan' },
      { name: 'Dubai International', code: 'DXB', country: 'United Arab Emirates' },
      { name: 'Los Angeles International', code: 'LAX', country: 'United States' },
      { name: 'Frankfurt Airport', code: 'FRA', country: 'Germany' },
      { name: 'Singapore Changi Airport', code: 'SIN', country: 'Singapore' },
    ];

    const openDrawer = () => {
      const drawer = document.getElementById('playground-drawer') as HTMLElement & { open: boolean };
      if (drawer) {
        drawer.open = true;
      }
    };

    const handleAirportSelect = (airport: { name: string; code: string }) => {
      const airportSelect = document.querySelector('lit-airport-select') as HTMLElement & {
        selectedItem: string;
        itemCode: string;
      };
      if (airportSelect) {
        airportSelect.selectedItem = airport.name;
        airportSelect.itemCode = airport.code;
      }
      const drawer = document.getElementById('playground-drawer') as HTMLElement & { open: boolean };
      if (drawer) {
        drawer.open = false;
      }
    };

    const handleSearchInput = (e: CustomEvent) => {
      const searchValue = e.detail.value.toLowerCase();
      const listContainer = document.querySelector('#airport-list');

      const filtered = airports.filter(
        (airport) =>
          airport.name.toLowerCase().includes(searchValue) ||
          airport.code.toLowerCase().includes(searchValue) ||
          airport.country.toLowerCase().includes(searchValue)
      );

      if (listContainer) {
        if (filtered.length === 0) {
          listContainer.innerHTML = '<div class="px-5 py-8 text-center text-secondary-300">No airports found</div>';
        } else {
          listContainer.innerHTML = `
            <div class="bg-secondary-40 px-5 py-2 text-sm text-secondary-500 uppercase tracking-wide mb-2">
              ${filtered.length} Airport${filtered.length !== 1 ? 's' : ''}
            </div>
            <div class="pl-6">
              ${filtered.map((airport) => `
                <div class="border-b border-secondary-80 py-4 pr-5 flex justify-between items-center cursor-pointer" 
                     onclick="this.dispatchEvent(new CustomEvent('airport-selected', { bubbles: true, composed: true, detail: { name: '${airport.name}', code: '${airport.code}' } }))">
                  <div>
                    <div class="font-bold text-base text-neutral-black mb-1">${airport.name}</div>
                    <div class="text-sm text-secondary-300">${airport.country}</div>
                  </div>
                  <div class="text-base text-secondary-500">${airport.code}</div>
                </div>
              `).join('')}
            </div>
          `;
        }
      }
    };

    setTimeout(() => {
      const drawer = document.getElementById('playground-drawer');
      if (drawer) {
        drawer.addEventListener('airport-selected', ((e: CustomEvent) => {
          handleAirportSelect(e.detail);
        }) as EventListener);
      }
    }, 0);

    return html`
    <div class="h-screen bg-secondary-20">
      <div class="flex items-center justify-center h-screen">
        <div class="w-full max-w-md px-4">
          <lit-airport-select
            label="Departure"
            placeholder="Select departure airport"
            @airport-click=${openDrawer}
          ></lit-airport-select>
        </div>
      </div>

      <lit-drawer
        id="playground-drawer"
        ?open=${args.open}
        ?hide-close=${args.hideClose}
        @input=${(e: Event) => args.onInput?.(e)}
        @search=${(e: Event) => args.onSearch?.(e)}
        @clear=${(e: Event) => args.onClear?.(e)}
      >
        <span slot="header">Select departure airport</span>
        
        
        <div slot="body">

          <lit-search-input
            class="p-4 pt-0"
            size="medium"
            placeholder="Search by name, code, or country..."
            @input=${handleSearchInput}
          ></lit-search-input>

          <div id="airport-list">
            <div class="bg-secondary-40 px-5 py-2 text-sm text-secondary-500 uppercase tracking-wide mb-2">
              ${airports.length} Airports
            </div>
            <div class="pl-6">
              ${airports.map(
      (airport) => html`
                  <div 
                    class="border-b border-secondary-80 py-4 pr-5 flex justify-between items-center cursor-pointer"
                    @click=${() => handleAirportSelect(airport)}
                  >
                    <div>
                      <div class="font-bold text-base text-neutral-black mb-1">
                        ${airport.name}
                      </div>
                      <div class="text-sm text-secondary-300">${airport.country}</div>
                    </div>
                    <div class="text-base text-secondary-500">${airport.code}</div>
                  </div>
                `
    )}
            </div>
          </div>
        </div>

        <!-- <div slot="footer">
          <div class="p-5 flex items-center justify-between bg-secondary-20">
            <div class="flex items-center gap-4">
              <lit-icon icon="circle-flags:us" size="36px"></lit-icon>
              <span class="font-semibold text-base">USD</span>
            </div>
            <lit-button variant="secondary" size="medium">
              <span>Change currency</span>
            </lit-button>
          </div>
        </div> -->
      </lit-drawer>
    </div>
  `;
  },
  argTypes: {
    onInput: { action: 'input' },
    onSearch: { action: 'search' },
    onClear: { action: 'clear' },
  },
};
