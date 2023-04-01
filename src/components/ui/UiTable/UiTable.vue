<template>
  <div>
		<div class="aup-table" :style="styleVars">
			<div class="aup-table__left-column">
				<div class="aup-table__column-header aup-table__left-column-header">
					ЗЕТ
				</div>

				<div
					class="aup-table__zet-block"
					v-for="i in !loading ? maxZet : fakeMaxZet"
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
						:value="table[key]"
						:setData="setData"
						@change="onDragElementTable($event, key)"
					>
						<div v-for="element in column" :key="element.id">
							<ui-table-block
								:data="{ element, group: getGroupById(element.id_group) }"
                :height="`${heightTableBlock(element)}px`"
								@edit="$emit('edit', $event)"
							/>
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
						<ui-table-skeleton-block />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import UiTableBlock from '../UiTableBlock/UiTableBlock.vue'
import GroupsService from '@services/Groups/GroupsService'
import orderWords from '@utils/orderWords'
import UiTableSkeletonBlock from '../UiTableSkeletonBlock/UiTableSkeletonBlock.vue'

export default {
  components: { UiTableBlock, draggable, UiTableSkeletonBlock },
  props: {
    table: {
      type: Array,
      default: () => [],
    },
    maxZet: {
      type: Number,
      default: 30,
    },
    loading: Boolean,
  },
  data() {
    return {
      orderWords,
      fakeElementsCount: 8,
		  fakeMaxZet: 30,
    }
  },
  computed: {
    dragOptions() {
			return {
				animation: 250,
				group: 'map',
			}
		},

    allGroupsMapId() {
      return GroupsService.allGroupsMapId
    },

    heightTableBlock() {
			return data => 90 * this.totalZet(data)
		},

		styleVars() {
			return {
				'--count-column': this.countOfColumns,
			}
		},

    countOfColumns() {
			if (this.loading) return this.fakeElementsCount

			return Object.keys(this.table).length
		},
  },
  methods: {
    onDragElementTable(data, columnIndex) {
			this.$emit('drag', { data, columnIndex })
		},

    getGroupById(idGroup) {
			return this.allGroupsMapId[idGroup]
		},

    totalZet(data) {
			return data.type.reduce((sum, zetBlock) => {
				return sum + zetBlock?.zet
			}, 0)
		},

    setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},
  }
}
</script>

<style lang="sass">
.aup-table
    display: grid
    grid-template-columns: 30px repeat(var(--count-column), minmax(100px, 1fr))
    gap: 8px
    color: #fff

    &__draggable
        flex: 1 1 100%
    
    &__column
        display: flex
        flex-direction: column
		
    &__block-wrapper
        transition: all 0.3s ease
        padding: 5px 0

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
        transition: all 0.3s ease
        display: flex
        justify-content: center
        align-items: center

.flip-list-move
    transition: transform 0.5s

.no-move
  transition: transform 0s
</style>
