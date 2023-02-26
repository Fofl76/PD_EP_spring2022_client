<template>
	<v-app>
		<div
			class="Home"
			:class="{ withRightMenu: drawerModel }"
			:style="styleVars"
		>
			<HomeHeader
				:tableReady="isReady"
				:aupCode="aupCode"
				@successUpload="onSuccessUploadFile"
				@errorUpload="onErrorUploadFile"
			/>

			<v-main dark app class="Home__main">
				<v-container class="Home__main-inner" fluid>
					<template v-if="isReady || isLoading">
						<Table
							:loading="isLoading"
							:table="table"
							@change="onChangeTable"
							@clickEdit="onClickEditTable"
						/>
					</template>
					<template v-else>
						<div class="Home__main-empty">
							<div class="Home__main-empty-inner">
								<v-icon
									class="Home__main-empty-icon"
									color="rgba(255, 255, 255, 0.7)"
									:size="120"
								>
									mdi-information-outline
								</v-icon>
								<p class="Home__main-empty-title text-h5">Нет данных</p>
								<span class="Home__main-empty-subtitle subtitle-1"
									>Выберите факультет и направление</span
								>
							</div>
						</div>
					</template>

					<v-btn
						v-if="isAvailableSave"
						class="Home__save-table-btn"
						:loading="loadingSaveMap"
						color="success"
						dark
						@click="onSaveMap"
					>
						<span>Сохранить карту</span>
						<v-icon right dark> mdi-content-save </v-icon>
					</v-btn>
				</v-container>
			</v-main>

			<RightMenuEditBlock
				v-model="drawerModel"
				:item="drawerItem"
				:loading="loadingSaveMap"
				:width="drawerWidth"
				@edit="onEditItem"
				@save="onSaveEdit"
			/>

			<MSnackbar
				v-model="snackbarModel"
				:type="snackbarType"
				:settings="snackbarSettings"
			/>

			<MSnackbar
				v-model="snackbarUploadFileModel"
				:type="snackbarUploadType"
				:settings="snackbarUploadSettings"
				:timeout="2500"
			/>
		</div>
	</v-app>
</template>

<script>
import _ from 'lodash'
import axios from '@api/axios'
import Table from '@components/Table.vue'
import MSnackbar from '@components/ui/MSnackbar.vue'
import RightMenuEditBlock from '@components/RightMenuEditBlock.vue'
import PopupUploadDocument from '@components/PopupUploadDocument.vue'
import HomeHeader from '@components/Home/HomeHeader.vue'

import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'Home',

	components: {
		HomeHeader,
		Table,
		RightMenuEditBlock,
		PopupUploadDocument,
		MSnackbar,
	},

	data: () => ({
		isLoading: false,

		snackbarModel: false,
		snackbarType: 'error',
		snackbarSettings: {
			error: {
				title: 'Ошибка при сохранении карты',
				text: 'Не удалось сохранить карту',
			},
			success: { text: 'Карта успешно сохранена' },
		},

		availableDirections: [],

		facultyModel: '',
		directionModel: '',

		aupCode: null,
		isAvailableSave: false,

		table: [],
		drag: false,

		drawerModel: false,
		drawerItem: null,
		loadingSaveMap: false,
		drawerWidth: 400,

		popupUploadModel: false,

		snackbarUploadFileModel: false,
		snackbarUploadType: 'error',
		snackbarUploadSettings: {
			error: {
				title: 'Ошибка при загрузке файла',
				text: 'Не удалось сохранить карту.',
			},
			success: { text: 'Карта успешно сохранена.' },
		},
	}),

	computed: {
		...mapGetters('Maps', ['mapsList']),

		isReady() {
			return !!this.table.length
		},

		styleVars() {
			return {
				'--drawer-width': this.drawerWidth + 'px',
			}
		},
	},

	watch: {
		'$route.query.aup': {
			async handler(aupCode) {
				await this.fetchMap(aupCode)
			},
			deep: true,
			immediate: true,
		},
	},

	methods: {
		sortColumn(column) {
			return _.sortBy(column, ['num_row'])
		},

		buildTable(data) {
			const columns = _.groupBy(data, 'num_col')

			const sortedColumns = []

			for (const key in columns) {
				sortedColumns.push(this.sortColumn(columns[key]))
			}

			this.table = sortedColumns
		},

		clearTable() {
			this.table = []
			this.aupCode = null
			this.isAvailableSave = false
		},

		onChangeTable() {
			this.isAvailableSave = true
		},

		onClickEditTable(element) {
			this.drawerModel = true
			this.drawerItem = element
		},

		async fetchMap(aupCode) {
			try {
				this.isLoading = true
				const res = await axios.get(`map/${aupCode}`)
				const data = res.data
				this.aupCode = aupCode

				this.facultyModel = ''
				this.directionModel = ''

				this.buildTable(data.data)
			} catch (e) {
				this.clearTable()
			} finally {
				this.isLoading = false
			}
		},

		async onSaveMap() {
			let res = null

			try {
				const table = this.table
					.map((column, colId) => {
						return column.map((block, rowId) => {
							return {
								...block,
								num_col: colId,
								num_row: rowId,
							}
						})
					})
					.flat()

				this.loadingSaveMap = true

				res = await axios.post(`save/${this.aupCode}`, table)
				return res
			} catch (e) {
				console.log(e)
			} finally {
				this.snackbarModel = true
				if (res?.status === 200) {
					this.snackbarType = 'success'
				} else {
					this.snackbarType = 'error'
				}

				this.loadingSaveMap = false
				this.isAvailableSave = false
			}
		},

		onEditItem({ oldCol, oldRow, newItem }) {
			if (oldCol !== null && oldRow !== null && newItem) {
				let neededColIndex = null
				this.table.forEach((col, colIndex) => {
					let isWanted = false
					col.forEach(el => {
						if (el.id === newItem.id) {
							neededColIndex = colIndex
							return
						}
					})

					if (isWanted) return
				})

				if (neededColIndex === null) return

				const copyCol = this.table[neededColIndex].map(item => {
					if (item.id === newItem.id) {
						return newItem
					} else {
						return item
					}
				})

				// костыль
				this.$set(this.table, neededColIndex, copyCol)
			}
		},

		async onSaveEdit() {
			const res = await this.onSaveMap()

			if (res?.status === 200) {
				this.drawerModel = false
			}
		},

		onSuccessUploadFile(aup) {
			this.$router.push({ path: '/', query: { aup } })

			this.snackbarUploadType = 'success'
			this.snackbarUploadFileModel = true
		},

		onErrorUploadFile(res) {
			this.snackbarUploadType = 'error'
			this.snackbarUploadSettings.error.text = res.data
			this.snackbarUploadFileModel = true
		},
	},
}
</script>

<style lang="sass">
.Home
    height: 100%

    &__main
        height: 100%
        background-color: #444

    &__main-inner
        box-shadow: 0px 0px 100px 5px rgba(0, 0, 0, 0.3) inset
        padding: 16px
        height: 100%

    &__main-empty
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        font-size: 1.5em

    &__main-empty-inner
        color: #fff
        display: flex
        flex-direction: column
        align-items: center

    &__main-empty-icon
        margin-bottom: 12px

    &__main-empty-title
        margin-bottom: 4px !important

    &__nodata-block
        color: #fff

    &__save-table-btn
        position: fixed
        bottom: 30px
        right: 30px
        transition: right .2s cubic-bezier(0.4, 0, 0.2, 1)

.Home.withRightMenu
    .Home
        &__save-table-btn
            right: calc(var(--drawer-width) + 30px)
</style>
