<template>
	<div style="position: relative">
		The man-month as a unit for measuring the size of a job is a dangerous and deceptive myth.
		It implies that men and months are interchangeable. This is only true when a task can be
		partitioned among many workers with no communication among them. This is true of reaping
		wheat or picking cotton; it is not even approximately true of systems programming. When a
		task cannot be partitioned because of sequential constraints, the application of more effort
		has no effect on the schedule. The bearing of a child takes nine months, no matter how many
		women are assigned. Many software tasks have this characteristic because of debugging and
		testing constraints. The second fallacy is that progress is proportional to the number of
		people. Yet, adding people to a late software project makes it later, due to training and
		communication overhead.
		<px-mask :step="1" :line-width="2"></px-mask>
	</div>
</template>
