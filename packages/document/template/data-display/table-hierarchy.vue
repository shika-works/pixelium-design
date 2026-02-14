<template>
	<px-table
		:data="data"
		:columns="columns"
		:scroll="{ x: 1500 }"
		:table-area-props="{ style: 'max-height: 400px' }"
	></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
	{
		label: 'Basic Information',
		align: 'center',
		key: 'base-info',
		children: [
			{
				label: 'ID',
				field: 'id',
				width: 80,
				align: 'center',
				key: 'id'
			},
			{
				label: 'Name',
				field: 'name',
				width: 120,
				key: 'name'
			}
		]
	},
	{
		label: 'Contact Information',
		key: 'contactInformation',
		children: [
			{
				label: 'Contact Details',
				key: 'contactDetails',
				children: [
					{
						key: 'phone',
						label: 'Phone',
						field: 'phone',
						minWidth: 120
					},
					{
						key: 'email',
						label: 'Email',
						field: 'email',
						minWidth: 180
					}
				]
			},
			{
				label: 'Address',
				field: 'address',
				key: 'address',
				minWidth: 200
			}
		]
	},
	{
		label: 'Work Information',
		key: 'workInformation',
		children: [
			{
				label: 'Department',
				field: 'department',
				key: 'department',
				width: 120
			},
			{
				label: 'Salary Information',
				key: 'salaryInformation',
				children: [
					{
						label: 'Base Salary',
						field: 'baseSalary',
						key: 'baseSalary',
						width: 100,
						align: 'right'
					},
					{
						label: 'Bonus',
						field: 'bonus',
						key: 'bonus',
						width: 100,
						align: 'right'
					},
					{
						label: 'Total',
						field: 'totalSalary',
						key: 'totalSalary',
						width: 100,
						align: 'right'
					}
				]
			}
		]
	},
	{
		label: 'Status',
		field: 'status',
		width: 80,
		fixed: 'right',
		key: 'status',
		align: 'center'
	}
]

const data = ref([
	{
		id: 1,
		name: 'John Smith',
		phone: '+1 (212) 555-0198',
		email: 'john.smith@example.com',
		address: '123 Main St, New York, NY',
		department: 'Sales',
		baseSalary: 5000,
		bonus: 1000,
		totalSalary: 6000,
		status: 'Active'
	},
	{
		id: 2,
		name: 'Emily Johnson',
		phone: '+44 20 7946 0958',
		email: 'emily.j@example.com',
		address: '456 Park Ave, Los Angeles, CA',
		department: 'Marketing',
		baseSalary: 4500,
		bonus: 800,
		totalSalary: 5300,
		status: 'Active'
	},
	{
		id: 3,
		name: 'Michael Brown',
		phone: '+61 2 9876 5432',
		email: 'm.brown@example.com',
		address: '789 Broadway, Chicago, IL',
		department: 'Engineering',
		baseSalary: 7000,
		bonus: 1500,
		totalSalary: 8500,
		status: 'Active'
	},
	{
		id: 4,
		name: 'Sarah Davis',
		phone: '+49 30 12345678',
		email: 'sarah.davis@example.com',
		address: '101 Oak St, Houston, TX',
		department: 'HR',
		baseSalary: 4800,
		bonus: 600,
		totalSalary: 5400,
		status: 'On Leave'
	},
	{
		id: 5,
		name: 'David Wilson',
		phone: '+33 1 2345 6789',
		email: 'd.wilson@example.com',
		address: '202 Pine Rd, Phoenix, AZ',
		department: 'Finance',
		baseSalary: 6500,
		bonus: 1200,
		totalSalary: 7700,
		status: 'Active'
	},
	{
		id: 6,
		name: 'Jennifer Taylor',
		phone: '+81 3 1234 5678',
		email: 'jennifer.t@example.com',
		address: '303 Elm St, Philadelphia, PA',
		department: 'Sales',
		baseSalary: 5200,
		bonus: 900,
		totalSalary: 6100,
		status: 'Active'
	},
	{
		id: 7,
		name: 'Robert Miller',
		phone: '+1 (415) 555-0134',
		email: 'robert.m@example.com',
		address: '404 Cedar Ave, San Antonio, TX',
		department: 'Engineering',
		baseSalary: 7200,
		bonus: 1600,
		totalSalary: 8800,
		status: 'Active'
	},
	{
		id: 8,
		name: 'Lisa Anderson',
		phone: '+44 131 496 0600',
		email: 'lisa.a@example.com',
		address: '505 Maple Dr, San Diego, CA',
		department: 'Marketing',
		baseSalary: 4700,
		bonus: 700,
		totalSalary: 5400,
		status: 'Inactive'
	},
	{
		id: 9,
		name: 'William Thomas',
		phone: '+61 8 8123 4567',
		email: 'william.t@example.com',
		address: '606 Birch Ln, Dallas, TX',
		department: 'Finance',
		baseSalary: 6800,
		bonus: 1300,
		totalSalary: 8100,
		status: 'Active'
	},
	{
		id: 10,
		name: 'Maria Jackson',
		phone: '+49 89 98765432',
		email: 'maria.j@example.com',
		address: '707 Walnut St, San Jose, CA',
		department: 'HR',
		baseSalary: 4900,
		bonus: 650,
		totalSalary: 5550,
		status: 'Active'
	}
])
</script>
