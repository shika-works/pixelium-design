<script setup lang="ts">
import { computed, ref, shallowRef, onMounted } from 'vue'
import { useData } from 'vitepress'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import langVue from '@shikijs/langs/vue'
import langTs from '@shikijs/langs/typescript'
import langJs from '@shikijs/langs/javascript'
import themeVitesseLight from '@shikijs/themes/vitesse-light'
import themeVitesseDark from '@shikijs/themes/vitesse-dark'
import type { HighlighterCore } from 'shiki/core'

const props = defineProps<{ code?: string; title?: string; description?: string }>()

const { page, isDark } = useData()
const open = ref(false)
const copied = ref(false)
const highlighter = shallowRef<HighlighterCore | null>(null)

const zh = computed(() => page.value.relativePath?.startsWith('zh') ?? false)

const txt = computed(() => {
	const en = {
		copy: 'Copy code',
		expand: 'Expand code',
		fold: 'Fold code',
		hide: 'Hide source code'
	}
	const cn = { copy: '复制代码', expand: '展开代码', fold: '折叠代码', hide: '隐藏源代码' }
	return zh.value ? cn : en
})

const raw = computed(() => {
	try {
		return decodeURIComponent(props.code || '')
	} catch {
		return props.code || ''
	}
})

function detectLang(code: string): string {
	if (/<template[\s\S]*?<\/template>/.test(code)) return 'vue'
	if (/\bsetup\b|from ['"]vue['"]/.test(code)) return 'vue'
	if (/interface\s+\w+|:\s*(string|number|boolean)\b/.test(code)) return 'ts'
	return 'js'
}

const highlighted = computed(() => {
	if (!highlighter.value) return ''
	const res = highlighter.value.codeToHtml(raw.value, {
		lang: detectLang(raw.value),
		theme: isDark.value ? 'vitesse-dark' : 'vitesse-light'
	})
	return res
})

onMounted(async () => {
	highlighter.value = await createHighlighterCore({
		themes: [themeVitesseLight, themeVitesseDark],
		langs: [langVue, langTs, langJs],
		engine: createJavaScriptRegexEngine()
	})
})

async function copy() {
	try {
		await navigator.clipboard.writeText(raw.value)
	} catch {
		const ta = document.createElement('textarea')
		ta.value = raw.value
		document.body.appendChild(ta)
		ta.select()
		document.execCommand('copy')
		document.body.removeChild(ta)
	}
	copied.value = true
	setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
	<div class="px-demo-container">
		<section class="px-demo-description">
			<div v-if="title" class="px-demo-description__title">{{ title }}</div>
			<div v-if="description" class="px-demo-description__content" v-html="description" />
		</section>

		<section class="px-demo-preview">
			<slot />
		</section>

		<div class="px-demo-description__handle-btn">
			<button class="px-demo-btn" :title="txt.copy" @click="copy">
				<svg
					v-if="copied"
					class="px-demo-btn__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
				<svg
					v-else
					class="px-demo-btn__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			</button>
			<button
				class="px-demo-btn"
				:class="{ 'px-demo-btn--active': open }"
				:title="open ? txt.fold : txt.expand"
				@click="open = !open"
			>
				<svg
					class="px-demo-btn__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="16 18 22 12 16 6" />
					<polyline points="8 6 2 12 8 18" />
				</svg>
			</button>
		</div>

		<section class="px-demo-code" :style="{ maxHeight: open ? '2000px' : '0px' }">
			<div class="px-demo-source" v-html="highlighted" />
			<div class="px-demo-close" @click="open = false">
				{{ txt.hide }}
			</div>
		</section>
	</div>
</template>

<style scoped>
.px-demo-container {
	position: relative;
	margin: 16px 0;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background-color: var(--vp-c-bg);
	overflow: hidden;
	transition:
		border-color 0.25s,
		box-shadow 0.25s;
}

.px-demo-container:hover {
	border-color: var(--vp-c-brand-1);
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.px-demo-preview {
	position: relative;
	box-sizing: border-box;
	min-height: 120px;
	padding: 40px 24px;
	overflow-x: auto;
}

.px-demo-preview :deep(> *) {
	max-width: 100%;
	box-sizing: border-box;
}

.px-demo-description {
	box-sizing: border-box;
	padding: 16px 80px 20px 24px;
	border-bottom: 1px solid var(--vp-c-divider);
	background-color: var(--vp-c-bg);
}

.px-demo-description__title {
	font-size: 16px;
	font-weight: 600;
	line-height: 1.5;
	color: var(--vp-c-text-1);
}

.px-demo-description__content {
	margin-top: 8px;
	font-size: 14px;
	line-height: 1.6;
	color: var(--vp-c-text-2);
}

.px-demo-description__split-line {
	height: 1px;
	margin-top: 12px;
	background: repeating-linear-gradient(
		to right,
		var(--vp-c-divider) 0,
		var(--vp-c-divider) 6px,
		transparent 6px,
		transparent 12px
	);
}

.px-demo-description__handle-btn {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 4px;
	box-sizing: border-box;
	padding: 8px 12px;
	border-top: 1px solid var(--vp-c-divider);
}

.px-demo-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	padding: 0;
	border: 1px solid transparent;
	border-radius: 6px;
	background: transparent;
	color: var(--vp-c-text-2);
	font-size: 14px;
	cursor: pointer;
	transition:
		background-color 0.2s,
		color 0.2s,
		border-color 0.2s;
}

.px-demo-btn:hover {
	background-color: var(--vp-c-brand-soft);
	color: var(--vp-c-brand-1);
	border-color: var(--vp-c-brand-1);
}

.px-demo-btn__icon {
	width: 16px;
	height: 16px;
}

.px-demo-btn--active .px-demo-btn__icon {
	transform: rotate(180deg);
}

.px-demo-code {
	overflow: hidden;
	transition: max-height 0.3s ease;
}

.px-demo-close {
	padding: 10px 0 14px;
	text-align: center;
	font-size: 13px;
	line-height: 1.5;
	color: var(--vp-c-text-2);
	cursor: pointer;
	user-select: none;
	transition: color 0.25s;
}

.px-demo-close:hover {
	color: var(--vp-c-brand-1);
}

:deep(.px-demo-source pre) {
	display: block;
	box-sizing: border-box;
	margin: 0;
	padding: 16px;
	overflow: auto;
	background-color: transparent;
	border-radius: 0;
	font-family: Consolas, Monaco, 'Courier New', monospace;
	font-size: 13px;
	line-height: 1.7;
	white-space: pre;
	tab-size: 2;
}

@media (max-width: 640px) {
	.px-demo-description {
		padding-right: 24px;
	}

	.px-demo-preview {
		padding: 24px 16px;
	}
}
</style>
