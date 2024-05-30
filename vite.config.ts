import react from '@vitejs/plugin-react';
import path from 'path';
import {
    defineConfig
} from 'vite';

// https://vitejs.dev/config/
export default defineConfig(env => {
	return {
		base: env.mode === 'production' ? '/color-picker' : '',
		plugins: [react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		}
	};
});