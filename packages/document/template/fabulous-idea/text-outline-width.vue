<template>
	<div>
		<div style="padding: 8px; background: #222" v-for="value in [1, 2, 4, 8, 16]" :key="value">
			<px-text-outline
				color="#fff"
				:outlineWidth="value"
				:style="{
					fontSize: 14 + value + 'px',
					color: 'rgb(0, 168, 145)'
				}"
			>
				Outlined Text
			</px-text-outline>
		</div>
		<div style="padding: 8px; background: #222" v-for="value in [1, 2, 4]" :key="value">
			<px-text-outline
				color="#fff"
				outlineWidth="0.1em"
				:style="{
					fontSize: 14 * value + 'px',
					paddingLeft: '0.2em',
					paddingRight: '0.2em',
					color: 'rgb(0, 168, 145)'
				}"
			>
				Outlined Text
			</px-text-outline>
		</div>
	</div>
</template>
