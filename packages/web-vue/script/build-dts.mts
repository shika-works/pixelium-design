import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TARGET_DIR = './lib'

async function processDirectory(dir: string): Promise<void> {
	const entries = await readdir(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = join(dir, entry.name)

		if (entry.isDirectory()) {
			await processDirectory(fullPath)
		} else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
			await processFile(fullPath)
		}
	}
}

async function processFile(filePath: string): Promise<void> {
	const content = await readFile(filePath, 'utf-8')
	const replaced = content.replaceAll(
		`import("@vue/reactivity").OnCleanup`,
		`((cleanupFn: () => void) => void)`
	)

	if (content !== replaced) {
		await writeFile(filePath, replaced, 'utf-8')
		console.log(`✅ Updated: ${filePath}`)
	}
}

;(async () => {
	try {
		await processDirectory(TARGET_DIR)
		console.log('🎉 All .d.ts files processed.')
	} catch (err) {
		console.error('❌ Error processing files:', err)
		process.exit(1)
	}
})()
