import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './lit-search-input';
import './lit-mobile-viewport';
import './lit-button';
import './lit-icon';

const meta: Meta = {
  title: 'Design System/SearchInput',
  component: 'lit-search-input',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'large'],
      description: 'Size of the search input (medium: 44px, large: 54px)',
    },
    value: {
      control: 'text',
      description: 'Current search query value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search input is disabled',
    },
  },
  args: {
    size: 'large',
    value: '',
    placeholder: 'Search destinations',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

// Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <lit-search-input
      size="${args.size}"
      value="${args.value}"
      placeholder="${args.placeholder}"
      ?disabled="${args.disabled}"
      @input="${(e: CustomEvent) => console.log('Input:', e.detail.value)}"
      @search="${(e: CustomEvent) => console.log('Search:', e.detail.value)}"
      @clear="${() => console.log('Cleared')}"
    ></lit-search-input>
  `,
};

// All states for large size (📱 Mobile viewport)
export const AllStatesLarge: Story = {
  name: 'All States - Large',
  render: () => html`      
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Empty</h3>
          <lit-search-input 
            size="large"
            placeholder="Search flights"
          ></lit-search-input>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">With Value</h3>
          <lit-search-input 
            size="large"
            value="Barcelona"
          ></lit-search-input>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Disabled</h3>
          <lit-search-input 
            size="large"
            placeholder="Disabled search"
            disabled
          ></lit-search-input>
        </div>
      </div>
  `,
};

// All states for medium size (📱 Mobile viewport)
export const AllStatesMedium: Story = {
  name: 'All States - Medium',
  render: () => html`      
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Empty</h3>
          <lit-search-input 
            size="medium"
            placeholder="Search"
          ></lit-search-input>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">With Value</h3>
          <lit-search-input 
            size="medium"
            value="Paris"
          ></lit-search-input>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-600 mb-2">Disabled</h3>
          <lit-search-input 
            size="medium"
            placeholder="Disabled search"
            disabled
          ></lit-search-input>
        </div>
      </div>
  `,
};

// Real-world context with event handling (📱 Mobile viewport)
export const InContext: Story = {
  render: () => {
    // Store search results in a simple state management approach
    let searchResults: string[] = [];

    const handleSearch = (e: CustomEvent) => {
      const query = e.detail.value;
      console.log('Search submitted:', query);

      // Mock search results
      if (query.toLowerCase().includes('barcelona')) {
        searchResults = ['Barcelona, Spain (BCN)', 'Barcelona El Prat Airport'];
      } else if (query.toLowerCase().includes('paris')) {
        searchResults = ['Paris, France (CDG)', 'Paris Orly Airport'];
      } else if (query) {
        searchResults = ['No results found'];
      } else {
        searchResults = [];
      }

      // Update the results display
      const resultsDiv = document.querySelector('.search-results');
      if (resultsDiv) {
        resultsDiv.innerHTML = searchResults.length
          ? `<div class="text-sm text-gray-600 mb-2">Results:</div>${searchResults.map(r => `<div class="p-2 bg-white rounded border border-gray-200 text-sm">${r}</div>`).join('')}`
          : '';
      }
    };

    const handleClear = () => {
      console.log('Search cleared');
      searchResults = [];
      const resultsDiv = document.querySelector('.search-results');
      if (resultsDiv) {
        resultsDiv.innerHTML = '';
      }
    };

    return html`
      <lit-mobile-viewport width="small" background="white">
        <div class="p-6">
          <h1 class="text-xl font-bold mb-2">✈️ Flight Search</h1>
          <p class="text-gray-500 text-sm mb-5">Find your next destination</p>
          
          <div class="flex flex-col gap-4">
            <!-- Search Section -->
            <div>
              <h2 class="text-sm font-semibold mb-2">Search Flights</h2>
              <lit-search-input 
                size="large"
                placeholder="Search destinations"
                @search="${handleSearch}"
                @clear="${handleClear}"
              ></lit-search-input>
              <div class="search-results flex flex-col gap-2 mt-3"></div>
            </div>

            <!-- Quick Filters -->
            <div class="pt-3 border-t border-gray-200">
              <h2 class="text-sm font-semibold mb-3">Quick Filters</h2>
              <div class="flex flex-col gap-2">
                <lit-search-input 
                  size="medium"
                  placeholder="Filter by airline"
                ></lit-search-input>
                <lit-search-input 
                  size="medium"
                  placeholder="Filter by price"
                ></lit-search-input>
              </div>
            </div>

            <!-- Popular Destinations -->
            <div class="pt-3 border-t border-gray-200">
              <h2 class="text-sm font-semibold mb-3">Popular Destinations</h2>
              <div class="grid grid-cols-2 gap-2">
                <lit-button variant="secondary" size="small">
                  <lit-icon icon="circle-flags:es" size="16"></lit-icon>
                  <span>Barcelona</span>
                </lit-button>
                <lit-button variant="secondary" size="small">
                  <lit-icon icon="circle-flags:fr" size="16"></lit-icon>
                  <span>Paris</span>
                </lit-button>
                <lit-button variant="secondary" size="small">
                  <lit-icon icon="circle-flags:gb" size="16"></lit-icon>
                  <span>London</span>
                </lit-button>
                <lit-button variant="secondary" size="small">
                  <lit-icon icon="circle-flags:us" size="16"></lit-icon>
                  <span>New York</span>
                </lit-button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-2 pt-4">
              <lit-button variant="primary" size="medium" class="w-full">
                Search Flights
              </lit-button>
              <lit-button variant="secondary" size="medium" class="w-full">
                Advanced Search
              </lit-button>
            </div>
          </div>
        </div>
      </lit-mobile-viewport>
    `;
  },
};
