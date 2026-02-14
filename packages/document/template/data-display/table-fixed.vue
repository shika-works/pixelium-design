<template>
	<px-table
		:data="data"
		:columns="columns"
		row-key="id"
		:table-area-props="{ style: 'max-height: 400px' }"
		:scroll="{ x: 1200 }"
		:pagination="false"
	></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
	{
		id: 1,
		name: 'John Smith',
		age: 28,
		phone: '+1-555-101-2001',
		email: 'john.smith@example.com',
		address: '123 Main St, Springfield, IL 62704'
	},
	{
		id: 2,
		name: 'Jane Johnson',
		age: 34,
		phone: '+1-555-102-2002',
		email: 'jane.johnson@example.com',
		address: '456 Oak Ave, Shelbyville, IL 62706'
	},
	{
		id: 3,
		name: 'Bob Williams',
		age: 22,
		phone: '+1-555-103-2003',
		email: 'bob.williams@example.com',
		address: '789 Pine Rd, Capital City, IL 62708'
	},
	{
		id: 4,
		name: 'Alice Brown',
		age: 45,
		phone: '+1-555-104-2004',
		email: 'alice.brown@example.com',
		address: '101 Maple Dr, Metropolis, IL 62710'
	},
	{
		id: 5,
		name: 'Charlie Jones',
		age: 31,
		phone: '+1-555-105-2005',
		email: 'charlie.jones@example.com',
		address: '202 Cedar Ln, Smallville, IL 62712'
	},
	{
		id: 6,
		name: 'Diana Garcia',
		age: 29,
		phone: '+1-555-106-2006',
		email: 'diana.garcia@example.com',
		address: '303 Birch St, Gotham, NY 10001'
	},
	{
		id: 7,
		name: 'Eve Miller',
		age: 38,
		phone: '+1-555-107-2007',
		email: 'eve.miller@example.com',
		address: '404 Elm Pl, Star City, NY 10003'
	},
	{
		id: 8,
		name: 'Frank Davis',
		age: 26,
		phone: '+1-555-108-2008',
		email: 'frank.davis@example.com',
		address: '505 Walnut Way, Central City, NY 10005'
	},
	{
		id: 9,
		name: 'Grace Rodriguez',
		age: 41,
		phone: '+1-555-109-2009',
		email: 'grace.rodriguez@example.com',
		address: '606 Spruce Ct, Coast City, CA 90210'
	},
	{
		id: 10,
		name: 'Henry Martinez',
		age: 33,
		phone: '+1-555-110-2010',
		email: 'henry.martinez@example.com',
		address: '707 Ash Blvd, Emerald City, CA 90212'
	},
	{
		id: 11,
		name: 'Ivy Hernandez',
		age: 27,
		phone: '+1-555-111-2011',
		email: 'ivy.hernandez@example.com',
		address: '808 Poplar Ave, Keystone City, CA 90214'
	},
	{
		id: 12,
		name: 'Jack Lopez',
		age: 36,
		phone: '+1-555-112-2012',
		email: 'jack.lopez@example.com',
		address: '909 Fir St, National City, TX 75001'
	},
	{
		id: 13,
		name: 'Kate Gonzalez',
		age: 24,
		phone: '+1-555-113-2013',
		email: 'kate.gonzalez@example.com',
		address: '111 Redwood Dr, Opal City, TX 75003'
	},
	{
		id: 14,
		name: 'Leo Wilson',
		age: 39,
		phone: '+1-555-114-2014',
		email: 'leo.wilson@example.com',
		address: '222 Sequoia Ln, Ivy Town, TX 75005'
	},
	{
		id: 15,
		name: 'Mia Anderson',
		age: 30,
		phone: '+1-555-115-2015',
		email: 'mia.anderson@example.com',
		address: '333 Magnolia Rd, Hub City, FL 32003'
	},
	{
		id: 16,
		name: 'Nick Thomas',
		age: 42,
		phone: '+1-555-116-2016',
		email: 'nick.thomas@example.com',
		address: '444 Willow Cir, Blue Valley, FL 32005'
	},
	{
		id: 17,
		name: 'Olivia Taylor',
		age: 35,
		phone: '+1-555-117-2017',
		email: 'olivia.taylor@example.com',
		address: '555 Cypress St, Starling City, FL 32007'
	},
	{
		id: 18,
		name: 'Paul Moore',
		age: 23,
		phone: '+1-555-118-2018',
		email: 'paul.moore@example.com',
		address: '666 Juniper Way, Fawcett City, WA 98001'
	},
	{
		id: 19,
		name: 'Quinn Jackson',
		age: 37,
		phone: '+1-555-119-2019',
		email: 'quinn.jackson@example.com',
		address: '777 Sycamore Pl, Gateway City, WA 98003'
	},
	{
		id: 20,
		name: 'Ryan Martin',
		age: 32,
		phone: '+1-555-120-2020',
		email: 'ryan.martin@example.com',
		address: '888 Laurel Ave, Coral City, WA 98005'
	}
])

const columns = [
	{
		key: 'id',
		label: 'Id',
		field: 'id',
		fixed: 'left'
	},
	{
		key: 'name',
		label: 'Name',
		field: 'name'
	},
	{
		key: 'age',
		label: 'Age',
		field: 'age'
	},
	{
		key: 'phone',
		label: 'Phone',
		field: 'phone'
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email'
	},
	{
		label: 'Address',
		field: 'address',
		key: 'address',
		fixed: 'right',
		width: 300
	}
]
</script>
