<template>
	<div>
		<p>
			Scrollable container below. BackTop listens to the container when <code>root</code> is
			set.
		</p>
		<div
			class="scroll-root"
			style="height: 220px; overflow: auto; border: 1px solid var(--px-neutral-6)"
		>
			<div style="height: 800px; background: linear-gradient(180deg, #fff, #f4f7fb)">
				<p style="padding: 12px">
					This container is scrollable — scroll inside it to trigger the BackTop button.
				</p>
			</div>
		</div>
		<!-- BackTop will listen to the .scroll-root element -->
		<px-back-top root=".scroll-root" :bottom="220">
			<template #trigger>
				<px-button theme="warning"> Custom Root ↑</px-button>
			</template>
		</px-back-top>
	</div>
</template>
