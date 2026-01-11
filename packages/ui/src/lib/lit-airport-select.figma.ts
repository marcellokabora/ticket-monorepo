import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for Airport Select component
 * Links Figma design to lit-airport-select implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=164-291
 */

figma.connect(
  'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=164-291',
  {
    props: {
      placeholder: figma.string('placeholder'),
      selectedItem: figma.string('selectedItem'),
      label: figma.string('label'),
      itemCode: figma.string('itemCode'),
      showDiscount: figma.boolean('showDiscount'),
      discountText: figma.string('discountText'),
      disabled: figma.boolean('disabled'),
    },
    example: ({ placeholder, selectedItem, label, itemCode, showDiscount, discountText, disabled }) => html`
      <lit-airport-select
        placeholder="${placeholder}"
        selectedItem="${selectedItem}"
        label="${label}"
        itemCode="${itemCode}"
        discountText="${discountText}"
        ?showDiscount="${showDiscount}"
        ?disabled="${disabled}">
      </lit-airport-select>
    `,
  }
);
