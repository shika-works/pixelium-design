<template>
	<px-table :data="data" :columns="columns"></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
	{
		key: 1,
		name: 'Olivia Martinez',
		role: 'Admin',
		email: 'olivia.martinez@company.com',
		address: '123 Maple Street, New York, NY 10001'
	},
	{
		key: 2,
		name: 'James Wilson',
		role: 'Developer',
		email: 'james.wilson@company.com',
		address: '456 Oak Avenue, San Francisco, CA 94102'
	},
	{
		key: 3,
		name: 'Sophia Chen',
		role: 'Designer',
		email: 'sophia.chen@company.com',
		address: '789 Pine Road, Chicago, IL 60601'
	},
	{
		key: 4,
		name: 'William Taylor',
		role: 'Manager',
		email: 'william.taylor@company.com',
		address: '321 Elm Boulevard, Austin, TX 73301'
	},
	{
		key: 5,
		name: 'Emma Johnson',
		role: 'Analyst',
		email: 'emma.johnson@company.com',
		address: '654 Cedar Lane, Seattle, WA 98101'
	}
])

const columns = [
	{
		key: 'name',
		label: 'Name',
		field: 'name',
		minWidth: 250
	},
	{
		key: 'role',
		label: 'Role',
		field: 'role',
		width: 120
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email',
		minWidth: 300
	},
	{
		key: 'address',
		label: 'Address',
		field: 'address',
		minWidth: 300
	}
]
</script>
