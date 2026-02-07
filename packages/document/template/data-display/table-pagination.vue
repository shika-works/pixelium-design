<template>
	<px-table
		:data="data"
		:columns="columns"
		:pagination="{
			showTotal: true,
			showJumper: true,
			showSize: true
		}"
		v-model:page-size="pageSize"
		v-model:page="page"
	></px-table>
	<div style="margin-top: 16px">page: {{ page }}; pageSize: {{ pageSize }}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const pageSize = ref(10)
const page = ref(1)

const columns = [
	{
		key: 'id',
		label: 'ID',
		field: 'id'
	},
	{
		key: 'user',
		label: 'User',
		field: 'user'
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email'
	},
	{
		key: 'register',
		label: 'Register',
		field: 'register'
	}
]

const firstNames = [
	'John',
	'Emma',
	'Michael',
	'Sarah',
	'David',
	'Lisa',
	'Robert',
	'Jennifer',
	'William',
	'Jessica',
	'James',
	'Amanda',
	'Christopher',
	'Melissa',
	'Daniel',
	'Stephanie',
	'Matthew',
	'Laura',
	'Joshua',
	'Michelle'
]

const lastNames = [
	'Smith',
	'Johnson',
	'Williams',
	'Brown',
	'Jones',
	'Miller',
	'Davis',
	'Garcia',
	'Rodriguez',
	'Wilson',
	'Martinez',
	'Anderson',
	'Taylor',
	'Thomas',
	'Jackson',
	'White',
	'Harris',
	'Martin',
	'Thompson',
	'Moore'
]

function generateRandomData(count: number) {
	const data: any[] = []
	const currentDate = new Date()

	for (let i = 1; i <= count; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
		const fullName = `${firstName} ${lastName}`

		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

		const randomDaysAgo = Math.floor(Math.random() * 365)
		const registerDate = new Date(currentDate)
		registerDate.setDate(registerDate.getDate() - randomDaysAgo)
		const registerDateStr = registerDate.toISOString().split('T')[0]

		data.push({
			id: i,
			user: fullName,
			email: email,
			register: registerDateStr
		})
	}

	return data
}

const data = ref(generateRandomData(50))
</script>
