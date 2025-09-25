import type { App } from 'vue'

import Button from './button/index.vue'
import ButtonGroup from './button-group/index.vue'
import Link from './link/index.vue'
import MessageBox from './message-box/message-box-wrapped.vue'
import Message from './message-box/index.ts'
import Row from './row/index.vue'
import Col from './col/index.vue'
import Divider from './divider/index.vue'
import Space from './space/index.vue'
import Grid from './grid/index.vue'
import GridItem from './grid-item/index.vue'
import Container from './container/index.vue'
import Main from './main/index.vue'
import Aside from './aside/index.vue'
import Header from './header/index.vue'
import Footer from './footer/index.vue'
import { setThemeColor } from './share/util/theme.ts'
import { useThemeMode } from './share/hook/use-theme-mode.ts'
import Icon from './icon/index.vue'
import { inBrowser } from './share/util/env.ts'

const components = [Button, ButtonGroup, Link, MessageBox, Row, Col, Divider, Space, Grid, GridItem, Container, Main, Aside, Header, Footer, Icon]

const defaultPrefix = 'Px'
const install = (
	app: App,
	options: {
		prefix: string
		attachToApp?: boolean
		attachToWindow?: boolean
	} = { prefix: defaultPrefix }
) => {
	components.forEach((component) => {
		component.name && app.component(options.prefix + component.name, component)
	})
	if (options.attachToApp !== false) {
		app.config.globalProperties.PixeliumVue = {
			message: Message,
			useThemeMode: useThemeMode
		}
	}
	if (options.attachToWindow !== false && inBrowser()) {
		// @ts-ignore
		window.$message = Message
	}
}
export { install }
export {
	Button,
	ButtonGroup,
	Link,
	MessageBox,
	Message,
	Row,
	Col,
	Divider,
	setThemeColor,
	Space,
	Grid,
	GridItem,
	Container,
	Main,
	Aside,
	Header,
	Footer,
	useThemeMode,
	Icon
}
export default {
	install
}
