<template>
	<px-space direction="vertical">
		<px-button-group>
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
		<px-button-group shape="round">
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
		<px-button-group loading>
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button disabled>Loading</px-button>
		</px-button-group>
		<px-button-group>
			<px-button>Primary</px-button>
			<px-button variant="outline" theme="sakura">Sakura</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button loading variant="text">Loading</px-button>
		</px-button-group>
		<px-button-group :border-radius="[20, 16, 20, 16]">
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
	</px-space>
</template>
