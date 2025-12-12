import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execaCommand } from 'execa'
import { rimraf } from 'rimraf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = join(__dirname, '..')

const $ = (cmd: string, opts = {}) =>
	execaCommand(cmd, { stdio: 'inherit', cwd: root, ...opts })

const log = (msg: string) => console.log(`\n🚀 ${msg}`)

try {
	log('Running lint:fix...')
	await $('npx oxlint ./ --fix')
	await $('npx prettier ./ --write')

	log('Cleaning output...')
	await rimraf.sync(join(root, 'dist'))
	await rimraf.sync(join(root, 'es'))

	log('Running vue-tsc...')
	await $('npx vue-tsc -b')
	await $('node script/build-dts.mts')

	log('Building font...')
	await $('npx vite build --config ./script/vite.config.font.ts')

	log('Building CSS...')
	await $('node script/build-css.mts')

	log('Building icons...')
	await $('node script/build-icon.mts')
	await $('npx vite build --config ./script/vite.config.icon-hn.ts')
	await $('npx vite build --config ./script/vite.config.icon-pa.ts')

	log('Building each...')
	await $('node script/build-each.mts')

	log('Building Vue...')
	await $('npx vite build --config ./script/vite.config.vue.ts')
	await $('npx dts-bundle-generator --no-check --config dts-bundle-generator.config.json')

	log('✅ Build completed successfully!')
} catch (err: any) {
	console.error('\n❌ Build failed:', err.message)
	process.exit(1)
}
