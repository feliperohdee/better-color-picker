import type {
    Meta,
    StoryObj
} from '@storybook/react';
import {
    fn
} from '@storybook/test';

import Picker from '@/components/Picker';

/* eslint-disable sort-keys */
const meta: Meta<typeof Picker> = {
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
		allowChangeType: {
			control: 'boolean'
		},
		className: {
			control: 'text'
		},
		defaultValue: {
			control: 'text'
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
		style: {
			control: 'object'
		},
		value: {
			control: 'text'
		}
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		onChange: fn()
	}
};
/* eslint-enable sort-keys */

type Story = StoryObj<typeof meta>;

export const Flat: Story = {
	args: {
		allowChangeType: true,
		className: '',
		defaultValue: '#d7006c',
		style: {
			borderRadius: '1.5rem',
			width: 300
		},
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
		allowChangeType: true,
		className: '',
		defaultValue: '#d7006c',
		style: {
			borderRadius: '1.5rem',
			width: 300
		},
		textAddColor: 'Adicionar Cor',
		textColor: 'Cor',
		textGradient: 'Gradiente',
		textLinear: 'Linear',
		textRadial: 'Radial',
		value: 'linear-gradient(to right, #d7006c, #feb47b, #aab47b, #af706c)'
	}
};

export default meta;