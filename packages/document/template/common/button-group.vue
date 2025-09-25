<template>
	<div style="display: flex; flex-direction: column">
		<px-button-group>
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
		<px-button-group shape="round" style="margin-top: 16px">
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
		<px-button-group variant="outline" style="margin-top: 16px">
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
		<px-button-group style="margin-top: 16px" :border-radius="[20, 16, 20, 16]">
			<px-button>Primary</px-button>
			<px-button theme="sakura">Sakura</px-button>
			<px-button color="#E956AE">#E956AE</px-button>
			<px-button loading>Loading</px-button>
		</px-button-group>
	</div>
</template>
