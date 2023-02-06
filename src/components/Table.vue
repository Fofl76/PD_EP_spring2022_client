<template>
	<div>
		<div class="aup-table" :style="styleVars">
			<div class="aup-table__left-column">
				<div class="aup-table__column-header aup-table__left-column-header">
					ZET
				</div>

				<div
					class="aup-table__zet-block"
					v-for="i in maxZet"
					:key="i"
					:style="{ height: '90px' }"
				>
					<span>{{ i }}</span>
				</div>
			</div>

			<template v-if="!loading">
				<div
					class="aup-table__column"
					v-for="(column, key) in table"
					:key="key"
				>
					<div class="aup-table__column-header">
						{{ orderWords[key] }}
					</div>

					<draggable
						class="aup-table__draggable"
						v-bind="dragOptions"
						v-model="table[key]"
						@change="onChangeTable"
						:setData="setData"
					>
						<div v-for="element in column" :key="element.id">
							<TableBlock :item="element" @edit="onClickEdit" />
						</div>
					</draggable>
				</div>
			</template>
			<template v-else>
				<div
					class="aup-table__column"
					v-for="(column, key) in fakeElementsCount"
					:key="key"
				>
					<div class="aup-table__column-header">
						{{ orderWords[key] }}
					</div>

					<div v-for="item in 10" :key="item.id">
						<TableSkeletonBlock />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import TableBlock from '@components/TableBlock'
import TableSkeletonBlock from '@components/TableSkeletonBlock'

import orderWords from '@utils/orderWords'

export default {
	name: 'Table',
	components: { draggable, TableBlock, TableSkeletonBlock },

	props: {
		table: {
			type: Array,
			required: true,
		},

		loading: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
		orderWords,
		fakeElementsCount: 8,
		fakeMaxZet: 30,
	}),

	computed: {
		dragOptions() {
			return {
				animation: 250,
				group: 'map',
			}
		},

		maxZet() {
			if (this.loading) return this.fakeMaxZet

			let maxZet = 0

			this.table.forEach(column => {
				let sum = 0
				column.forEach(element => (sum += +element.zet))
				if (sum > maxZet) maxZet = sum
			})

			return maxZet
		},

		countOfColumns() {
			if (this.loading) return this.fakeElementsCount

			return Object.keys(this.table).length
		},

		styleVars() {
			return {
				'--count-column': this.countOfColumns,
			}
		},
	},

	methods: {
		onChangeTable() {
			this.$emit('change')
		},

		onClickEdit(element) {
			this.$emit('clickEdit', element)
		},

		setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},
	},
}
</script>

<style lang="sass">
.aup-table
    display: grid
    grid-template-columns: 30px repeat(var(--count-column), minmax(100px, 1fr))
    gap: 8px
    color: #fff

    &__draggable
        height: 100%

    &__block-wrapper
        padding: 5px 0

    &__block
        position: relative
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        height: 100%
        padding: 5px
        text-align: center
        border-radius: 8px
        font-size: 1.2em
        font-family: sans-serif
        cursor: grab

        &:hover
            .aup-table__edit-btn
                opacity: 1

    &__name
        overflow: hidden
        line-height: 2rem
        max-height: 8rem
        -webkit-box-orient: vertical
        display: block
        display: -webkit-box
        overflow: hidden !important
        text-overflow: ellipsis
        -webkit-line-clamp: 4

    &__name-tooltip
        border: 111px solid red

    &__column-header
        text-align: center
        margin-bottom: 5px

    &__edit-btn
        background-color: rgba(255, 255, 255, 0.1)
        position: absolute
        right: 8px
        top: 8px
        opacity: 0
        transition: opacity .25s ease

    &__zet-block
        padding: 0
        text-align: center
        border-bottom: 1px solid #fff
        display: flex
        justify-content: center
        align-items: center

.flip-list-move
    transition: transform 0.5s

.no-move
  transition: transform 0s
</style>
