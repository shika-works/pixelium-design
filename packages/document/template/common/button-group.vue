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
			<px-button theme="notice">Notice</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
		<px-button-group loading>
			<px-button variant="text">Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE" variant="plain">#E956AE</px-button>
			<px-button disabled>Loading</px-button>
		</px-button-group>
		<px-button-group :border-radius="[24, 12, 24, 12]">
			<px-button>First</px-button>
			<px-button>Second</px-button>
			<px-button>Third</px-button>
			<px-button>Fourth</px-button>
		</px-button-group>
		<px-button-group shape="circle" theme="notice">
			<px-button>1</px-button>
			<px-button>2</px-button>
			<px-button>3</px-button>
			<px-button loading>4</px-button>
		</px-button-group>
	</px-space>
</template>
