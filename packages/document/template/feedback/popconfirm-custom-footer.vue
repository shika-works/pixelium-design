<template>
	<px-space>
		<px-popconfirm content="Custom Icon example">
			<template #icon>
				<IconMinds />
			</template>
			<px-button>Custom Icon</px-button>
		</px-popconfirm>
		<px-popconfirm content="No Icon example" :show-icon="false">
			<px-button>No Icon</px-button>
		</px-popconfirm>
		<px-popconfirm
			content="Custom Button example"
			ok-text="Yes, delete"
			cancel-text="No, keep it"
			cancel-button-props="{ theme: 'info' }"
			ok-button-props="{ theme: 'danger' }"
		>
			<px-button>Custom Button</px-button>
		</px-popconfirm>
		<px-popconfirm content="Custom footer example" v-model:visible="visible4CustomFooter">
			<template #footer> Custom Footer Content </template>
			<px-button>Custom Footer</px-button>
		</px-popconfirm>
	</px-space>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { IconMinds } from '@pixelium/web-vue/icon-hn/es'

const visible4CustomFooter = ref(false)
</script>
