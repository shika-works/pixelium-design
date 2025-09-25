import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { pascalCase } from 'parsnip-kit'
import path from 'path'

const targetDir = path.join(process.cwd(), 'node_modules/@hackernoon/pixel-icon-library/icons/SVG')

const imports: string[] = []
const icons: string[] = []
const types: string[] = ["import { DefineComponent, App } from 'vue'"]
function scanDirectory(dir: any, relativePath = '') {
	const items = readdirSync(dir)

	items.forEach((item: any) => {
		const fullPath = path.join(dir, item)
		const stat = statSync(fullPath)

		if (stat.isDirectory()) {
			scanDirectory(fullPath, path.join(relativePath, item))
		} else if (path.extname(item).toLowerCase() === '.svg') {
			const fileName = path.basename(item, '.svg')
			const pascalCaseName = pascalCase(`icon-${fileName}`)
			const importPath = path.join('@hackernoon/pixel-icon-library/icons/SVG', relativePath, item).replace(/\\/g, '/')
			icons.push(pascalCaseName)
			imports.push(`// @ts-ignored\nimport { default as ${pascalCaseName} } from '${importPath}'\nexport { ${pascalCaseName} }`)
			types.push(`export declare const ${pascalCaseName}: DefineComponent<Record<string, never>, Record<string, never>, any>`)
		}
	})
}

if (!existsSync(targetDir)) {
	console.error('Dir was not existed:', targetDir)
}

scanDirectory(targetDir)
const outputFile = 'lib/icons/icon-hn.ts'
const outputTypeFile = 'dist/icon-hn.d.ts'
const outputTypeFileEs = 'es/icons/icon-hn.d.ts'

const iconFile = `import type { App } from 'vue'
import './index.less'
${imports.join('\n')}
const components = [${icons.join(', ')}]
const componentNames = [${icons.map((name) => `'${name}'`).join(', ')}]
const defaultPrefix = 'Hn'
const install = (app: App, prefix = defaultPrefix) => {
	components.forEach((component, index) => {
		// @ts-ignored
		app.component(prefix + componentNames[index], component)
	})
}
export { install }
export default install
`
types.push(`declare const install: (app: App<any>, prefix?: string) => void\nexport default install\nexport { install }`)
mkdirSync('./es/icons', { recursive: true })
mkdirSync('./dist', { recursive: true })
writeFileSync(outputFile, iconFile)
writeFileSync(outputTypeFile, types.join('\n'))
writeFileSync(outputTypeFileEs, types.join('\n'))
console.log(`\nIcon building finished successfully.\n`)
