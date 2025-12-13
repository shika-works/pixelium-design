import { defineConfig } from 'vitepress'
import { dfs4Md } from './dfs-4-md'

const titleMap = {
	starting: '快速开始',
	guide: '开始',
	intro: '简介',
	font: '字体',
	theme: '自定义主题',
	'dark-mode': '暗黑模式',
	'pixel-size': '像素尺寸',
	'update-plan': '更新计划',
	changelog: '更新日志',
	'controlled-and-uncontrolled': '受控 & 非受控模式'
}
const additionMap = {
	button: '按钮',
	icon: '图标',
	link: '链接',
	common: '通用组件',
	feedback: '反馈组件',
	config: '全局配置',
	message: '消息提示',
	layout: '布局组件',
	row: 'Flex 栅格',
	grid: 'Grid 栅格',
	divider: '分隔线',
	space: '间隔',
	container: '布局容器',
	'data-input': '数据输入组件',
	input: '文本输入',
	textarea: '多行文本',
	'input-number': '数字输入',
	'input-group': '复合输入控件',
	tag: '标签',
	'input-tag': '标签输入',
	popover: '弹出框',
	tooltip: '文本提示',
	empty: '空状态',
	'auto-complete': '自动填充',
	mask: '遮罩层',
	spin: '加载',
	select: '选择器',
	base: '基础组件',
	'virtual-list': '虚拟列表',
	'data-display': '数据展示组件',
	image: '图片',
	avatar: '头像',
	'fabulous-idea': '奇思妙想',
	pixelate: '图片像素化',
	form: '表单',
	switch: '开关',
	slider: '滑动选择器',
	radio: '单选框',
	checkbox: '复选框',
	'text-outline': '文本描边'
}

const sidebar = dfs4Md('zh', titleMap, additionMap)

export default defineConfig({
	title: 'Pixelium Design',
	themeConfig: {
		nav: [
			{ text: '首页', link: '/zh' },
			{ text: '文档', link: '/zh/guide/intro' }
		],
		sidebar: sidebar,
		search: {
			provider: 'local',
			options: {
				locales: {
					zh: {
						translations: {
							button: {
								buttonText: '搜索文档',
								buttonAriaLabel: '搜索文档'
							},
							modal: {
								noResultsText: '无法找到相关结果',
								resetButtonTitle: '清除查询条件',
								footer: {
									selectText: '选择',
									navigateText: '切换',
									closeText: '关闭搜索'
								}
							}
						}
					}
				}
			}
		}
	}
})
