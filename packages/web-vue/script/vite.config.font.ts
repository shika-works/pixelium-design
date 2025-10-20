import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		{
			name: 'css-url-replace',
			enforce: 'pre',
			generateBundle(_, bundles: Record<string, any>) {
				for (const [fileName, fileInfo] of Object.entries(bundles)) {
					if (fileInfo.type === 'asset' && fileName.endsWith('.css')) {
						const cssContent = fileInfo.source.replace(/url\(\s*['"]?\//g, 'url(./')
						fileInfo.source = cssContent
					}
				}
			}
		}
	],
	build: {
		rollupOptions: {
			input: {
				index: './lib/share/style/font.css'
			},
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'index.css') {
						return 'font.css'
					}
					return '[name][extname]'
				}
			}
		},
		emptyOutDir: false,
		outDir: 'dist'
	}
})
