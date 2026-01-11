import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./lit-bite-card";
import "./lit-mobile-viewport";
import "./lit-button";

const meta: Meta = {
  title: "Design System/BiteCard",
  component: "lit-bite-card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    background: {
      control: "select",
      options: ["white", "light"],
      description: "Background color of the card",
    },
    biteColor: {
      control: "select",
      options: ["primary-800", "white"],
      description: "Color of the bite separator",
    },
  },
  args: {
    background: "light",
    biteColor: "white",
  },
};

export default meta;
type Story = StoryObj;

// 1. Interactive playground
export const Playground: Story = {
  render: (args) => html`
    <div class="w-96">
      <lit-bite-card background="${args.background}" bite-color="${args.biteColor}">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">Ticket Information</h3>
          <p class="text-base text-neutral-500">Your content goes here</p>
        </div>
      </lit-bite-card>
    </div>
  `,
};

// 2. All variations
export const AllVariations: Story = {
  render: () => html`
    <div class="flex flex-col gap-8 w-96">
      <!-- White bite -->
      <p class="text-sm">White Bite</p>
        <lit-bite-card background="light" bite-color="white">
          <div class="p-6">
            <h4 class="text-lg font-semibold">Booking Confirmation</h4>
            <p class="text-sm mt-2">Subtle white separator</p>
          </div>
        </lit-bite-card>

      <!-- Green bite (primary-800) -->
      <p class="text-sm">Green Bite (Primary-800)</p>
      <div class="bg-primary-800 p-8 rounded-lg">
        <lit-bite-card background="light" bite-color="primary-800">
          <div class="p-6">
            <h4 class="text-lg font-semibold">Booking Confirmation</h4>
            <p class="text-sm text-neutral-500 mt-2">Green separator</p>
          </div>
        </lit-bite-card>
      </div>
    </div>
  `,
};

// 3. In Context - Realistic ticket-style layout
export const InContext: Story = {
  render: () => html`
    <lit-mobile-viewport width="small" background="white">
      <div class="bg-primary-800 p-8">
        <lit-bite-card background="white" bite-color="primary-800">
          <div class="p-6 flex flex-col gap-4">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-primary-500 mb-2">Booking Confirmed</h2>
              <p class="text-sm text-neutral-500">Transaction #FT-2025-1234</p>
            </div>

            <div class="border-t border-secondary-100 pt-4">
              <div class="flex justify-between mb-3">
                <span class="text-sm text-neutral-500">Departure</span>
                <span class="text-base font-semibold">London Heathrow (LHR)</span>
              </div>
              <div class="flex justify-between mb-3">
                <span class="text-sm text-neutral-500">Passengers</span>
                <span class="text-base font-semibold">2 adults</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-neutral-500">Total</span>
                <span class="text-xl font-bold text-primary-500">€45.00</span>
              </div>
            </div>

            <lit-button variant="primary" size="medium">
              <span>View Ticket</span>
            </lit-button>
          </div>
        </lit-bite-card>
      </div>
    </lit-mobile-viewport>
  `,
};
