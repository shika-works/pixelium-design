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
import {
	setThemeColor,
	resetThemeColor,
	setPixelSize,
	resetPixelSize
} from './share/util/theme.ts'
import { useThemeMode } from './share/hook/use-theme-mode.ts'
import Icon from './icon/index.vue'
import { inBrowser } from './share/util/env.ts'
import Input from './input/index.vue'
import InputNumber from './input-number/index.vue'
import Textarea from './textarea/index.vue'
import Tag from './tag/index.vue'
import InputGroup from './input-group/index.vue'
import InputGroupLabel from './input-group-label/index.vue'
import InputTag from './input-tag/index.vue'
import Tooltip from './tooltip/index.vue'
import Popover from './popover/index.vue'
import Empty from './empty/index.vue'
import AutoComplete from './auto-complete/index.vue'
import Mask from './mask/index.vue'
import Spin from './spin/index.vue'
import Select from './select/index.vue'
import VirtualList from './virtual-list/index.vue'
import Image from './image/index.vue'
import Avatar from './avatar/index.vue'
import Form from './form/index.vue'
import FormItem from './form-item/index.vue'
import { pixelateImage } from './pixelate/pixel.ts'
import { imageDataToDataURL } from './share/util/dom.ts'
import Switch from './switch/index.vue'
import Slider from './slider/index.vue'
import Radio from './radio/index.vue'
import RadioGroup from './radio-group/index.vue'
import Checkbox from './checkbox/index.vue'
import CheckboxGroup from './checkbox-group/index.vue'
import TextOutline from './text-outline/index.vue'
import { useForm } from './form/use-form.ts'
import Dialog from './dialog/index.ts'
import { locale } from './share/util/locale.ts'
import Alert from './alert/index.vue'
import Progress from './progress/index.vue'
import Popconfirm from './popconfirm/index.vue'
import Badge from './badge/index.vue'
import BackTop from './back-top/index.vue'
import Menu from './menu/index.vue'
import MenuItem from './menu-item/index.vue'
import MenuGroup from './menu-group/index.vue'
import Submenu from './submenu/index.vue'
import DropDown from './drop-down/index.vue'
import Breadcrumb from './breadcrumb/index.vue'
import BreadcrumbItem from './breadcrumb-item/index.vue'
import Scroll from './scroll-bar/index.vue'

const components = [
	Button,
	ButtonGroup,
	Link,
	MessageBox,
	Row,
	Col,
	Divider,
	Space,
	Grid,
	GridItem,
	Container,
	Main,
	Aside,
	Header,
	Footer,
	Icon,
	Input,
	InputNumber,
	Textarea,
	InputGroup,
	InputGroupLabel,
	Tag,
	InputTag,
	Tooltip,
	Popover,
	Empty,
	AutoComplete,
	Mask,
	Spin,
	Select,
	VirtualList,
	Image,
	Avatar,
	Form,
	FormItem,
	Switch,
	Slider,
	Radio,
	RadioGroup,
	Checkbox,
	CheckboxGroup,
	TextOutline,
	Dialog,
	Alert,
	Progress,
	Popconfirm,
	Badge,
	BackTop,
	Menu,
	MenuItem,
	MenuGroup,
	Submenu,
	DropDown,
	Breadcrumb,
	BreadcrumbItem,
	Scroll
]

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
		if (component.name) {
			app.component(options.prefix + component.name, component)
		}
	})
	if (options.attachToApp !== false) {
		app.config.globalProperties.PixeliumVue = {
			message: Message,
			dialog: Dialog,
			useThemeMode: useThemeMode
		}
	}
	if (options.attachToWindow !== false && inBrowser()) {
		// @ts-ignore
		window.$message = Message
		// @ts-ignore
		window.$dialog = Dialog
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
	Icon,
	Input,
	InputNumber,
	Textarea,
	InputGroup,
	InputGroupLabel,
	Tag,
	InputTag,
	Tooltip,
	Popover,
	Empty,
	AutoComplete,
	Mask,
	Spin,
	Select,
	resetThemeColor,
	setPixelSize,
	resetPixelSize,
	VirtualList,
	Image,
	Avatar,
	pixelateImage,
	Form,
	FormItem,
	Switch,
	Slider,
	Radio,
	RadioGroup,
	Checkbox,
	CheckboxGroup,
	imageDataToDataURL,
	TextOutline,
	useForm,
	Dialog,
	locale,
	Alert,
	Progress,
	Popconfirm,
	Badge,
	BackTop,
	Menu,
	MenuItem,
	MenuGroup,
	Submenu,
	DropDown,
	Breadcrumb,
	BreadcrumbItem,
	Scroll
}
export default {
	install
}

export type {
	Option,
	GroupOption,
	NumberOrPercentage,
	ValidContent,
	ValidVNodeContent,
	ValueWithDeviceWidth
} from './share/type/index.ts'

export type { MessageOptions, MessageReturn } from './message-box/type.ts'

export type { AutoCompleteOption, AutoCompleteGroupOption } from './auto-complete/type.ts'
export type { SelectOption, SelectGroupOption } from './select/type.ts'
export type { OptionListOption, OptionListGroupOption } from './option-list/type.ts'
export type { CheckboxGroupOption } from './checkbox-group/type.ts'
export type { RadioGroupOption } from './radio-group/type.ts'

export type {
	RuleItem,
	RuleTrigger,
	FieldType,
	RuleLevel,
	FormValidateResult,
	UseFormReturn
} from './form/type.ts'

export type { DropDownOption, DropDownGroupOption } from './drop-down-list/type.ts'
export type { MenuOption, MenuGroupOption, SubmenuOption } from './menu/type.ts'
export type { NavigationOption } from './share/type/index.ts'
export type { BreadcrumbOption } from './breadcrumb/type.ts'
