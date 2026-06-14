import { watch, existsSync } from 'fs'
import { execSync, spawn } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const docDir = resolve(fileURLToPath(import.meta.url), '../..')

let rebuildTimer: ReturnType<typeof setTimeout> | null = null
let building = false
let pendingRebuild = false

function runBuild(): void {
	if (building) {
		pendingRebuild = true
		return
	}
	building = true
	console.log('[gen-doc] 🔄 Rebuilding...')
	try {
		execSync('node script/gen-doc.mts', { cwd: docDir, stdio: 'inherit' })
		console.log('[gen-doc] ✅ Rebuild complete')
	} catch {
		console.error('[gen-doc] ❌ Build failed')
	} finally {
		building = false
		if (pendingRebuild) {
			pendingRebuild = false
			runBuild()
		}
	}
}

function scheduleRebuild(): void {
	if (rebuildTimer) clearTimeout(rebuildTimer)
	rebuildTimer = setTimeout(() => {
		runBuild()
	}, 300)
}

// ── Initial build ────────────────────────────────────────
console.log('[gen-doc] 📦 Running initial build...')
execSync('node script/gen-doc.mts', { cwd: docDir, stdio: 'inherit' })
console.log('[gen-doc] ✅ Initial build complete')

// ── Start vitepress dev ──────────────────────────────────
console.log('[gen-doc] 🚀 Starting vitepress dev...')
const vitepress = spawn('npx', ['vitepress', 'dev'], {
	cwd: docDir,
	stdio: 'inherit',
	shell: true
})

vitepress.on('error', (err: Error) => {
	console.error('[gen-doc] Failed to start vitepress:', err)
	process.exit(1)
})

// ── Watch template/ directory ────────────────────────────
const templateDir = resolve(docDir, 'template')
if (existsSync(templateDir)) {
	watch(templateDir, { recursive: true }, (_eventType, filename) => {
		if (filename && !filename.startsWith('.')) {
			console.log(`[gen-doc] 📝 Change detected: template/${filename}`)
			scheduleRebuild()
		}
	})
	console.log('[gen-doc] 👀 Watching: template/')
}

// ── Watch slice/ directory ───────────────────────────────
const sliceDir = resolve(docDir, 'slice')
if (existsSync(sliceDir)) {
	watch(sliceDir, { recursive: true }, (_eventType, filename) => {
		if (filename && !filename.startsWith('.')) {
			console.log(`[gen-doc] 📝 Change detected: slice/${filename}`)
			scheduleRebuild()
		}
	})
	console.log('[gen-doc] 👀 Watching: slice/')
}

// ── Graceful shutdown ────────────────────────────────────
const shutdown = () => {
	console.log('\n[gen-doc] Shutting down...')
	vitepress.kill()
	process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
