import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { pascalCase } from 'parsnip-kit'
import path from 'path'

interface IconSource {
	name: string
	targetDir: string
	importBase: string
	outputFile: string
	outputTypeFile: string
	outputTypeFileEs: string
	defaultPrefix: string
	styleFilePath: string
}

const iconSources: IconSource[] = [
	{
		name: 'pixel-icon-library',
		targetDir: path.join(
			process.cwd(),
			'node_modules/@hackernoon/pixel-icon-library/icons/SVG'
		),
		importBase: '@hackernoon/pixel-icon-library/icons/SVG',
		outputFile: 'lib/icons/icon-hn.ts',
		outputTypeFile: 'dist/icon-hn.d.ts',
		outputTypeFileEs: 'es/icons/icon-hn.d.ts',
		defaultPrefix: 'Hn',
		styleFilePath: './style-hn.less'
	},
	{
		name: 'pixelarticons',
		targetDir: path.join(process.cwd(), 'node_modules/pixelarticons/svg'),
		importBase: 'pixelarticons/svg',
		outputFile: 'lib/icons/icon-pa.ts',
		outputTypeFile: 'dist/icon-pa.d.ts',
		outputTypeFileEs: 'es/icons/icon-pa.d.ts',
		defaultPrefix: 'Pa',
		styleFilePath: './style-pa.less'
	}
]

function buildIcons(source: IconSource) {
	const imports: string[] = []
	const icons: string[] = []
	const types: string[] = ["import { DefineComponent, App } from 'vue'"]

	function scanDirectory(dir: string, relativePath = '') {
		const items = readdirSync(dir)
		items.forEach((item: string) => {
			const fullPath = path.join(dir, item)
			const stat = statSync(fullPath)
			if (stat.isDirectory()) {
				scanDirectory(fullPath, path.join(relativePath, item))
			} else if (path.extname(item).toLowerCase() === '.svg') {
				const fileName = path.basename(item, '.svg')
				const pascalCaseName = pascalCase(`icon-${fileName}`)
				const importPath = path.join(source.importBase, relativePath, item).replace(/\\/g, '/')
				icons.push(pascalCaseName)
				imports.push(
					`// @ts-ignored\nimport { default as ${pascalCaseName} } from '${importPath}'\nexport { ${pascalCaseName} }`
				)
				types.push(
					`export declare const ${pascalCaseName}: DefineComponent<Record<string, never>, Record<string, never>, any>`
				)
			}
		})
	}

	if (!existsSync(source.targetDir)) {
		console.error(`[${source.name}] Dir was not existed:`, source.targetDir)
		return
	}

	scanDirectory(source.targetDir)

	const iconFile = `import type { App } from 'vue'
import '${source.styleFilePath}'
${imports.join('\n')}
const components = [${icons.join(', ')}]
const componentNames = [${icons.map((name) => `'${name}'`).join(', ')}]
const defaultPrefix = '${source.defaultPrefix}'
const install = (app: App, prefix = defaultPrefix) => {
    components.forEach((component, index) => {
        // @ts-ignored
        app.component(prefix + componentNames[index], component)
    })
}
export { install }
export default install
`
	types.push(
		`declare const install: (app: App<any>, prefix?: string) => void\nexport default install\nexport { install }`
	)
	mkdirSync('./es/icons', { recursive: true })
	mkdirSync('./dist', { recursive: true })
	writeFileSync(source.outputFile, iconFile)
	writeFileSync(source.outputTypeFile, types.join('\n'))
	writeFileSync(source.outputTypeFileEs, types.join('\n'))
	console.log(`[${source.name}] Icon building finished successfully.`)
}

iconSources.forEach(buildIcons)
