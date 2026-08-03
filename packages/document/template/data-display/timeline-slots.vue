<template>
	<px-timeline>
		<px-timeline-item mark="2026-01" theme="primary">
			<template #header>
				<span style="color: #0960bd">First release</span>
			</template>
			<template #default>
				<span style="color: #00b42a">Initial version published 🎉</span>
			</template>
			<template #footer>
				<span style="color: #86909c">Published on 2026-01-15</span>
			</template>
		</px-timeline-item>
		<px-timeline-item mark="2026-03" theme="notice">
			<template #header>
				<span style="color: #0960bd">Feature update</span>
			</template>
			<template #default> Added custom dot, mark and slot support. </template>
		</px-timeline-item>
		<px-timeline-item mark="2026-06" theme="success">
			<template #header>
				<span style="color: #0960bd">Major release</span>
			</template>
			<template #default> Rewrote the rendering engine with better performance. </template>
			<template #footer>
				<span style="color: #d97706">Breaking changes</span>
			</template>
		</px-timeline-item>
	</px-timeline>
</template>
