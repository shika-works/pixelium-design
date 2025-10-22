import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				index: './lib/share/style/index.css'
			},
			output: {
				assetFileNames: '[name][extname]'
			}
		},
		emptyOutDir: false,
		outDir: 'es'
	}
})
