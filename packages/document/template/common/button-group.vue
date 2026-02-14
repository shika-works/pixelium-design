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
		<px-button-group theme="notice">
			<px-button>First</px-button>
			<px-button>Second</px-button>
			<px-button color="#E956AE">Third</px-button>
			<px-button loading variant="text">Fourth</px-button>
		</px-button-group>
		<px-button-group :border-radius="[20, 16, 20, 16]">
			<px-button>First</px-button>
			<px-button>Second</px-button>
			<px-button>Third</px-button>
			<px-button>Fourth</px-button>
		</px-button-group>
	</px-space>
</template>
