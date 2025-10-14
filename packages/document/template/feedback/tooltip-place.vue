<template>
	<div class="box">
		<div class="left">
			<px-tooltip
				v-for="item in ['left-start', 'left', 'left-end']"
				:key="item"
				:placement="item"
				:content="getContent(item)"
			>
				<px-button>{{ getLabel(item) }}</px-button>
			</px-tooltip>
		</div>
		<div class="center">
			<div class="top">
				<px-tooltip
					v-for="item in ['top-start', 'top', 'top-end']"
					:key="item"
					:placement="item"
					:content="getContent(item)"
				>
					<px-button>{{ getLabel(item) }}</px-button>
				</px-tooltip>
			</div>
			<div class="bottom">
				<px-tooltip
					v-for="item in ['bottom-start', 'bottom', 'bottom-end']"
					:key="item"
					:placement="item"
					:content="getContent(item)"
				>
					<px-button>{{ getLabel(item) }}</px-button>
				</px-tooltip>
			</div>
		</div>
		<div class="right">
			<px-tooltip
				v-for="item in ['right-start', 'right', 'right-end']"
				:key="item"
				:placement="item"
				:content="getContent(item)"
			>
				<px-button>{{ getLabel(item) }}</px-button>
			</px-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
const getLabel = (placement: string) => {
	return placement.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

const getContent = (placement: string) => {
	let contentArr: string[] = []
	if (placement.includes('-')) {
		const [pos, sub] = placement.split('-')
		contentArr = [capitalize(pos), capitalize(sub), 'Popover']
	} else {
		contentArr = [capitalize(placement), 'Popover']
	}

	return placement.startsWith('top') || placement.startsWith('bottom')
		? contentArr.join(' ')
		: contentArr.join('\n')
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
</script>

<style lang="css" scoped>
.box {
	display: flex;
	width: 600px;
	height: 350px;
	margin-left: 100px;
	margin-top: 64px;
	margin-bottom: 64px;
}
.left,
.right {
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.left {
	align-items: flex-start;
}
.right {
	align-items: flex-end;
}
.center {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.top,
.bottom {
	display: flex;
	justify-content: space-around;
}
.top {
	flex: 1;
}
</style>
