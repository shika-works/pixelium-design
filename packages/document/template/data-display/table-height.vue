<template>
	<px-table :data="data" :columns="columns" row-key="name" style="max-height: 400px"></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
	{
		name: 'Aric Ironfist',
		role: 'Blacksmith',
		level: 42,
		salary: 2800,
		address: 'Iron Forge Street 12'
	},
	{
		name: 'Lyra Swiftarrow',
		role: 'Hunter',
		level: 36,
		salary: 2200,
		address: 'Forest Edge Cottage'
	},
	{
		name: 'Borin Stonebeard',
		role: 'Miner',
		level: 28,
		salary: 1800,
		address: 'Mountain Hall 7'
	},
	{
		name: 'Elara Moonshadow',
		role: 'Alchemist',
		level: 51,
		salary: 3200,
		address: 'Apothecary Lane 3'
	},
	{
		name: 'Garrick Stormblade',
		role: 'Knight',
		level: 65,
		salary: 4500,
		address: 'Castle Barracks'
	},
	{
		name: 'Mira Whisperwind',
		role: 'Bard',
		level: 24,
		salary: 1500,
		address: 'Tavern Square 5'
	},
	{
		name: 'Thrain Forgeheart',
		role: 'Engineer',
		level: 47,
		salary: 2900,
		address: 'Workshop District 9'
	},
	{
		name: 'Sylas Greenleaf',
		role: 'Druid',
		level: 58,
		salary: 3800,
		address: 'Ancient Grove'
	},
	{
		name: 'Kaelen Firehand',
		role: 'Pyromancer',
		level: 61,
		salary: 4200,
		address: 'Mage Tower East'
	},
	{
		name: 'Freya Shieldmaiden',
		role: 'Guard Captain',
		level: 54,
		salary: 3600,
		address: 'Guard Post Central'
	},
	{
		name: 'Jorin Goldfinder',
		role: 'Merchant',
		level: 33,
		salary: 2500,
		address: 'Market Square 8'
	},
	{
		name: 'Nyssa Lightfoot',
		role: 'Rogue',
		level: 39,
		salary: 2700,
		address: 'Shadow Alley 2'
	},
	{
		name: 'Torin Boulderbreaker',
		role: 'Stone Mason',
		level: 31,
		salary: 2100,
		address: 'Quarry Road 4'
	},
	{
		name: 'Liana Starweaver',
		role: 'Astrologer',
		level: 45,
		salary: 3100,
		address: 'Observatory Hill'
	},
	{
		name: 'Finn Riverstride',
		role: 'Fisherman',
		level: 22,
		salary: 1400,
		address: 'Dockside Hut'
	},
	{
		name: 'Rowan Oakenshield',
		role: 'Carpenter',
		level: 27,
		salary: 1700,
		address: 'Timber Yard 6'
	},
	{
		name: 'Vera Nightshade',
		role: 'Herbalist',
		level: 34,
		salary: 2300,
		address: 'Herb Garden Cottage'
	},
	{
		name: 'Draven Bloodedge',
		role: 'Mercenary',
		level: 49,
		salary: 3300,
		address: "Fighter's Guild"
	},
	{
		name: 'Mara Swiftcurrent',
		role: 'Sailor',
		level: 26,
		salary: 1600,
		address: 'Harbor Watch 3'
	},
	{
		name: 'Orin Deepdelver',
		role: 'Archaeologist',
		level: 43,
		salary: 3000,
		address: "Explorer's Lodge"
	}
])

const columns = [
	{
		key: 'name',
		label: 'Name',
		field: 'name'
	},
	{
		key: 'role',
		label: 'Role',
		field: 'role'
	},
	{
		key: 'level',
		label: 'Level',
		field: 'level'
	},
	{
		key: 'salary',
		label: 'Salary',
		field: 'salary'
	},
	{
		label: 'Address',
		field: 'address',
		key: 'address'
	}
]
</script>
