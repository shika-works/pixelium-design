import { build, defineConfig } from 'vite'

await build(
	defineConfig({
		build: {
			emptyOutDir: false,
			outDir: 'es',
			rollupOptions: {
				input: {
					index: './lib/share/style/index.css'
				},
				output: {
					assetFileNames: '[name][extname]'
				}
			}
		}
	})
)

await build(
	defineConfig({
		build: {
			emptyOutDir: false,
			outDir: 'dist',
			rollupOptions: {
				input: {
					index: './lib/share/style/normalize.css'
				},
				output: {
					assetFileNames: 'normalize.css'
				}
			}
		}
	})
)
