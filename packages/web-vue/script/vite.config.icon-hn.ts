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
			entry: resolve(__dirname, '../lib/icons/icon-hn.ts'),
			name: 'PixeliumVueIconHn',
			fileName: 'pixelium-vue-icon-hn',
			cssFileName: 'pixelium-vue-icon-hn',
			formats: ['es', 'cjs', 'umd']
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				exports: 'named',
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
})
