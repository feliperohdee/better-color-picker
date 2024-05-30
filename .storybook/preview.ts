import '../src/style.css';

import {
	Preview
} from '@storybook/react';

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: 'dark',
			values: [{
				name: 'dark',
				value: '#333'
			}, {
				name: 'light',
				value: 'whitesmoke'
			}]
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
