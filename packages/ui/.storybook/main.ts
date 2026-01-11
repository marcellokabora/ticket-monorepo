import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-links',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    viteFinal: async (config) => {
        config.base = '/storybook/';
        return config;
    },
};

export default config;
