<template>
	<div class="MapRightMenuValueMainForm">
		<div
			class="MapRightMenuValueMainForm__row"
			v-for="(type, i) in values"
			:key="i"
		>
			<div class="MapRightMenuValueMainForm__label">
				{{ getControlTypesLabel(type.control_type_id) }}
			</div>

			<div class="MapRightMenuValueMainForm__input-row">
				<v-text-field
					:value="type.amount"
					label="Часы"
					type="number"
					ref="zet"
					hide-details
					dense
					filled
					dark
				/>

				<v-text-field
					:value="type.zet"
					label="ЗЕТ"
					:min="1"
					:max="10"
					type="number"
					ref="zet"
					hide-details
					dense
					filled
					dark
				/>
			</div>

			<v-checkbox
				:value="type.id_edizm === 2"
				class="MapRightMenuValueMainForm__week-checkbox"
				hide-details
				dense
			>
				<template #label>
					<div class="MapRightMenuValueMainForm__week-checkbox-label">
						Измерять в неделях
					</div>
				</template>
			</v-checkbox>
		</div>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuValueMainForm',

	data: () => ({
		MapsService,
	}),

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},

	computed: {
		getControlTypesLabel() {
			return control_id => {
				return this.MapsService.controlTypes.value.find(
					item => item.id === control_id
				).name
			}
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueMainForm
    &__row
        &:not(:last-child)
            margin-bottom: 16px

    &__input-row
        margin: 8px 0
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px

    &__week-checkbox
        margin-top: 0

    &__week-checkbox-label
        font-size: 14px
</style>
