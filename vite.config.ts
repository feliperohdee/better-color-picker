import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import path from 'path';
import {
	optimizeCssModules
} from 'vite-plugin-optimize-css-modules';
import {
    defineConfig,
	UserConfig
} from 'vite';

// https://vitejs.dev/config/
export default defineConfig(env => {
	const config: UserConfig = {
		base: './',
		plugins: [react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		}
	};

	if (env.mode === 'export') {
		config.build = {
			copyPublicDir: false,
			lib: {
				entry: './src/index-export.ts',
				fileName: 'index',
				formats: ['es']
			},
			rollupOptions: {
				external: [
					'react',
					'react-dom',
					'react/jsxRuntime',
					'tailwindcss'
				]
			}
		};

		config.plugins = [
			...config.plugins!,
			dts({
				exclude: [
					'**/*.spec.*',
					'**/*.stories.*'
				],
				include: [
					'./src/components/*',
					'./src/libs/*',
					'./src/index-export.ts'
				],
				insertTypesEntry: true,
				rollupTypes: true
			}),
			optimizeCssModules()
		];
	}
	
	return config;
});