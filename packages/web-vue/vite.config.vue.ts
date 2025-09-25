// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import viteSvgLoader from './plugin/svg-loader'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'vue-macros/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
	plugins: [Vue(), VueJsx(), VueMacros(), viteSvgLoader()],
	build: {
		target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'lib/index.ts'),
			name: 'PixeliumVue',
			fileName: 'pixelium-vue',
			cssFileName: 'pixelium-vue',
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
