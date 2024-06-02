<template>
	<div class="MapBelongsToPopupSearchTab">
		<v-text-field
			v-model="searchModel"
			class="MapBelongsToPopupSearchTab__search"
			label="Поиск"
			outlined
			dense
			hide-details="auto"
		/>

		<v-divider />

		<MapBelongsToPopupSearchTabList
			v-model="selectedItem"
			:disciplines="filteredItems"
			@delete="item => $emit('delete', item)"
		/>

		<v-divider />

		<v-list style="padding: 0px" dense>
			<v-list-item-group v-model="isCreateNewPressed" color="primary">
				<v-list-item :value="true">
					<v-list-item-icon>
						<v-icon color="grey">mdi-plus</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>Добавить</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</div>
</template>

<script>
import _ from 'lodash'
import MapBelongsToPopupSearchTabList from './MapBelongsToPopupSearchTabList.vue'

export default {
	components: {
		MapBelongsToPopupSearchTabList,
	},

	props: {
		allItems: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			searchModel: '',
			createNewPressedModel: false,
			selectedItemModel: null,
		}
	},

	computed: {
		isCreateNewPressed: {
			get() {
				return this.createNewPressedModel
			},

			set(v) {
				this.selectedItem = null
				this.createNewPressedModel = v
				this.$emit('create-new-press', v)
			},
		},

		selectedItem: {
			get() {
				return this.selectedItemModel
			},

			set(v) {
				if (v) {
					this.isCreateNewPressed = false
				}

				this.selectedItemModel = v
				this.$emit('select', v)
			},
		},

		filteredItems() {
			return _.orderBy(
				this.allItems?.filter(item => {
					return item.name
						.toLowerCase()
						.includes(this.searchModel.toLowerCase())
				}),
				'name',
			)
		},
	},
}
</script>

<style lang="scss" scoped></style>
