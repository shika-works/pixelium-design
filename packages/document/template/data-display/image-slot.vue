<template>
	<px-space style="font-size: 0">
		<px-image
			src="https://picsum.photos/id/106/200/100"
			alt="Image"
			style="width: 200px; height: 100px"
		>
			<template #placeholder> Loading... </template>
		</px-image>
		<px-image src="error-url" alt="Image" style="width: 200px; height: 100px">
			<template #error> Error! </template>
		</px-image>
	</px-space>
</template>
