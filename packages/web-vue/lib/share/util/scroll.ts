import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'

let run = false
export const initScroll = () => {
	if (run) {
		return
	}
	OverlayScrollbars.plugin(ClickScrollPlugin)
	run = true
}
