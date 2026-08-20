import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const candidates = [
	join(process.cwd(), 'packages/web-vue/package.json'),
	join(process.cwd(), '../web-vue/package.json')
]

const pkgPath = candidates.find((p) => existsSync(p))

const version: string = pkgPath ? JSON.parse(readFileSync(pkgPath, 'utf-8')).version : 'dev'

export { version }
