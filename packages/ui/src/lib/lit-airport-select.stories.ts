import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-airport-select';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/AirportSelect',
  component: 'lit-airport-select',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text (e.g., "Departure", "Arrival")',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder instruction text shown in rest state',
    },
    selectedItem: {
      control: 'text',
      description: 'Selected airport name',
    },
    itemCode: {
      control: 'text',
      description: 'Airport IATA code (e.g., "LHR", "JFK")',
    },
    showDiscount: {
      control: 'boolean',
      description: 'Whether to show promotional discount banner',
    },
    discountText: {
      control: 'text',
      description: 'Discount promotional message',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
  },
  args: {
    label: 'Departure',
    placeholder: 'Select departure airport',
    selectedItem: '',
    itemCode: '',
    showDiscount: false,
    discountText: 'Enjoy 20% off online purchase!',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

// Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <lit-airport-select
      label="${args.label}"
      instruction="${args.instruction}"
      selectedItem="${args.selectedItem}"
      itemCode="${args.itemCode}"
      ?showDiscount="${args.showDiscount}"
      discountText="${args.discountText}"
      ?disabled="${args.disabled}"
    ></lit-airport-select>
  `,
};

// All states and variations (📱 Mobile viewport)
export const AllStates: Story = {
  render: () => html`      
      <div class="flex flex-col gap-6">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Default</h3>
          <lit-airport-select 
            label="Departure"
            instruction="Select departure airport"
          ></lit-airport-select>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Selected</h3>
          <lit-airport-select 
            label="Departure"
            selectedItem="London - Heathrow"
            itemCode="LHR"
          ></lit-airport-select>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Discount</h3>
          <lit-airport-select 
            label="Departure"
            instruction="Select departure airport"
            showDiscount
            discountText="Enjoy 20% off online purchase!"
          ></lit-airport-select>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Disabled</h3>
          <lit-airport-select 
            label="Departure"
            selectedItem="London - Heathrow"
            itemCode="LHR"
            disabled
          ></lit-airport-select>
        </div>
      </div>  `,
};

// Airport variations
export const AirportVariations: Story = {
  render: () => html`
    <div>      
      <div class="flex flex-col gap-4">
        <lit-airport-select 
          label="Departure"
          selectedItem="New York - JFK"
          itemCode="JFK"
        ></lit-airport-select>

        <lit-airport-select 
          label="Arrival"
          selectedItem="Paris - Charles de Gaulle International Airport"
          itemCode="CDG"
        ></lit-airport-select>

        <lit-airport-select 
          label="Departure"
          selectedItem="Tokyo - Narita"
          itemCode="NRT"
        ></lit-airport-select>

        <lit-airport-select 
          label="Arrival"
          selectedItem="Dubai International"
          itemCode="DXB"
        ></lit-airport-select>
      </div>
    </div>
  `,
};

// In Context - Shows component composition with other lit-components AND event handling
export const InContext: Story = {
  render: () => {
    const handleAirportClick = (e: CustomEvent) => {
      console.log('Airport field clicked:', e.detail);
      alert(`Opening airport picker for ${e.detail.type}`);
    };

    const handleSearch = () => {
      console.log('Searching flights...');
      alert('Searching for flights!');
    };

    const handleSwapAirports = () => {
      console.log('Swapping airports...');
      alert('Departure and arrival airports swapped!');
    };

    return html`
      <lit-mobile-viewport width="small" background="gray">
        <div class="flex flex-col gap-6 p-6">
          <!-- Flight Search Form -->
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <lit-icon icon="mdi:airplane-takeoff"></lit-icon>
              Book Your Flight
            </h3>
            
            <lit-airport-select 
              label="Departure"
              selectedItem="London - Heathrow"
              itemCode="LHR"
              @airport-click=${handleAirportClick}
            ></lit-airport-select>

            <div class="flex justify-center -my-2">
              <lit-button 
                @click=${handleSwapAirports}
                aria-label="Swap airports"
                icon-only
              >
                <lit-icon icon="mdi:swap-vertical"></lit-icon>
              </lit-button>
            </div>

            <lit-airport-select 
              label="Arrival"
              instruction="Select arrival airport"
              @airport-click=${handleAirportClick}
            ></lit-airport-select>

            <lit-button 
              variant="primary" 
              size="medium" 
              class="w-full"
              @click=${handleSearch}
            >
              <span>Search Flights</span>
              <lit-icon icon="mdi:magnify"></lit-icon>
            </lit-button>
          </div>

          <!-- With Discount Promo -->
          <div class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold">Special Offer</h3>
            
            <lit-airport-select 
              label="Departure"
              instruction="Select departure airport"
              showDiscount
              discountText="Enjoy 20% off online purchase!"
              @airport-click=${handleAirportClick}
            ></lit-airport-select>
          </div>

          <!-- Multi-City Trip -->
          <div class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <lit-icon icon="mdi:map-marker-multiple"></lit-icon>
              Multi-City Trip
            </h3>
            
            <div class="flex flex-col gap-2">
              <p class="text-sm text-gray-600">Flight 1</p>
              <lit-airport-select 
                label="From"
                selectedItem="New York - JFK"
                itemCode="JFK"
                @airport-click=${handleAirportClick}
              ></lit-airport-select>
            </div>

            <div class="flex flex-col gap-2">
              <p class="text-sm text-gray-600">Flight 2</p>
              <lit-airport-select 
                label="From"
                selectedItem="Paris - Charles de Gaulle"
                itemCode="CDG"
                @airport-click=${handleAirportClick}
              ></lit-airport-select>
            </div>

            <lit-button 
              variant="secondary" 
              size="small" 
              class="w-full"
            >
              <lit-icon icon="mdi:plus"></lit-icon>
              <span>Add Another Flight</span>
            </lit-button>
          </div>
        </div>
      </lit-mobile-viewport>
    `;
  },
};
