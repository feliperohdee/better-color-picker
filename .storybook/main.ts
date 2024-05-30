import {
	StorybookConfig
} from '@storybook/react-vite';

const config: StorybookConfig = {
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials'
	],
	framework: {
		name: '@storybook/react-vite',
		options: {}
	},
	stories: [
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
	]
};

export default config;