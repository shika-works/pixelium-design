// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import viteSvgLoader from '../plugin/svg-loader.ts'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue(), viteSvgLoader()],
	build: {
		target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, '../lib/icons/icon-pa.ts'),
			name: 'PixeliumVueIconPa',
			fileName: 'pixelium-vue-icon-pa',
			cssFileName: 'pixelium-vue-icon-pa',
			formats: ['es', 'cjs', 'umd']
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
})
