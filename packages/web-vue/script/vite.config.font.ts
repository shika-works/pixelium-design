import { copyFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { defineConfig } from 'vite'

// The font is redistributed with the package, so its license has to ship next to it.
const FONT_LICENSE_FILES = [
	['./lib/share/assets/font/LICENSE-Fusion-Pixel-OFL.txt', 'LICENSE-Fusion-Pixel-OFL.txt'],
	['./lib/share/assets/font/LICENSE/ark-pixel.txt', 'LICENSE/ark-pixel.txt'],
	['./lib/share/assets/font/LICENSE/cubic-11.txt', 'LICENSE/cubic-11.txt'],
	['./lib/share/assets/font/LICENSE/galmuri.txt', 'LICENSE/galmuri.txt']
] as const

export default defineConfig({
	plugins: [
		{
			name: 'font-license',
			writeBundle(options) {
				const outDir = options.dir ?? 'dist'
				for (const [src, fileName] of FONT_LICENSE_FILES) {
					const dest = join(outDir, fileName)
					mkdirSync(dirname(dest), { recursive: true })
					copyFileSync(src, dest)
				}
			}
		},
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
