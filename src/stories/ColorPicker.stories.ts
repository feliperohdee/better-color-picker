import type {
    Meta,
    StoryObj
} from '@storybook/react';
import {
    fn
} from '@storybook/test';

import Picker from '@/components/Picker';

/* eslint-disable sort-keys */
const meta = {
	title: 'Picker',
	component: Picker,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: [
		'autodocs'
	],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		defaultValue: {
			control: 'color'
		},
		onChange: {
			action: 'onChange',
			control: false
		},
		textAddColor: {
			control: 'text'
		},
		textColor: {
			control: 'text'
		},
		textGradient: {
			control: 'text'
		},
		textLinear: {
			control: 'text'
		},
		textRadial: {
			control: 'text'
		},
		value: {
			control: 'color'
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		onChange: fn()
	}
} satisfies Meta<typeof Picker>;
/* eslint-enable sort-keys */

type Story = StoryObj<typeof meta>;

export const Flat: Story = {
	args: {
		defaultValue: '#d7006c',
		textAddColor: 'Adicionar Cor',
		textColor: 'Cor',
		textGradient: 'Gradiente',
		textLinear: 'Linear',
		textRadial: 'Radial',
		value: '#d7006c'
	}
};

export const Gradient: Story = {
	args: {
		defaultValue: '#d7006c',
		textAddColor: 'Adicionar Cor',
		textColor: 'Cor',
		textGradient: 'Gradiente',
		textLinear: 'Linear',
		textRadial: 'Radial',
		value: 'linear-gradient(to right, #d7006c, #feb47b, #aab47b, #af706c)'
	}
};

export default meta;