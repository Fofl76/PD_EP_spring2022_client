<template>
	<div class="MapRightMenuValueSumForm">
		<v-text-field
			:value="hours"
			label="Сумма часов"
			type="number"
			hide-details
			readonly
			dense
			filled
			dark
		/>

		<v-text-field
			:value="zet"
			label="Сумма ЗЕТ"
			type="number"
			hide-details
			readonly
			dense
			filled
			dark
		/>
	</div>
</template>

<script>
export default {
	name: 'MapRightMenuValueSumForm',

	props: {
		hours: {
			type: Number,
			default: null,
		},

		zet: {
			type: Number,
			default: null,
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueSumForm
    margin: 8px 0
    display: grid
    grid-template-columns: 1fr 1fr
    grid-template-rows: 1fr
    gap: 8px
</style>
