<template>
	<v-app>
		<div
			class="Home"
			:class="{ withRightMenu: drawerModel }"
			:style="styleVars"
		>
			<v-app-bar
				app
				class="Home__header full-width"
				height="80"
				dark
				clipped-right
			>
				<div class="Home__header-inner">
					<v-select
						class="Home__input Home__input-faculty"
						:menu-props="{ offsetY: false }"
						:items="mapsList"
						item-text="faculty_name"
						@input="onSelectFaculty"
						return-object
						label="Выберите факультет"
						hide-details="auto"
						dark
						filled
						dense
					></v-select>

					<v-autocomplete
						label="Введите направление"
						class="Home__input Home__input-direction"
						v-model="value"
						:items="availableDirections"
						@input="onSelectDirection"
						no-data-text="Направления не найдены"
						item-text="map_name"
						return-object
						hide-details="auto"
						dark
						filled
						dense
					></v-autocomplete>
				</div>

				<v-spacer></v-spacer>

				<v-btn @click="popupUploadModel = true" text dark>
					<span>Загрузить план</span>
					<v-icon right dark>mdi-upload</v-icon>
				</v-btn>

				<v-btn
					v-if="isReady"
					:href="`http://127.0.0.1:5000/save/${aupCode}`"
					target="_blank"
					text
					dark
				>
					<span>Скачать</span>
					<v-icon right dark>mdi-download</v-icon>
				</v-btn>

				<PopupUploadDocument
					v-model="popupUploadModel"
					@success="onSuccessUploadFile"
					@error="onErrorUploadFile"
				/>
			</v-app-bar>

			<v-main dark app class="Home__main">
				<v-container class="Home__main-inner" fluid>
					<Table
						v-if="isReady"
						:table="table"
						@change="onChangeTable"
						@clickEdit="onClickEditTable"
					/>
					<div v-else class="Home__nodata-block">Нет данных</div>

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
				v-model="snackbarUploadFileModel"
				:type="snackbarUploadType"
				:settings="snackbarUploadSettings"
				:timeout="2500"
			/>

			<MSnackbar
				v-model="snackbarModel"
				:type="snackbarType"
				:settings="snackbarSettings"
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

export default {
	name: 'Home',

	components: { Table, RightMenuEditBlock, PopupUploadDocument, MSnackbar },

	data: () => ({
		snackbarModel: false,
		snackbarType: 'error',
		snackbarSettings: {
			error: {
				title: 'Ошибка при сохранении карты',
				text: 'Не удалось сохранить карту',
			},
			success: { text: 'Карта успешно сохранена' },
		},

		mapsList: [],
		availableDirections: [],

		aupCode: null,
		isAvailableSave: false,

		value: null,
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
		isReady() {
			return this.table.length
		},

		styleVars() {
			return {
				'--drawer-width': this.drawerWidth + 'px',
			}
		},
	},

	methods: {
		onSelectFaculty(faculty) {
			this.availableDirections = faculty.data
		},

		async onSelectDirection(direction) {
			await this.fetchMap(direction.map_id)
		},

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

		async fetchAllMapsList() {
			const res = await axios.get('getAllMaps')
			const data = res.data

			this.mapsList = data
		},

		async fetchMap(aupCode) {
			try {
				const res = await axios.get(`map/${aupCode}`)
				const data = res.data
				this.aupCode = aupCode

				this.buildTable(data.data)
			} catch (e) {
				this.clearTable()
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

		onSuccessUploadFile() {
			this.snackbarUploadType = 'success'
			this.snackbarUploadFileModel = true
		},

		onErrorUploadFile(res) {
			this.snackbarUploadType = 'error'
			this.snackbarUploadSettings.error.text = res.data
			this.snackbarUploadFileModel = true
		},
	},

	async created() {
		this.fetchAllMapsList()
	},
}
</script>

<style lang="sass">
.Home
    height: 100%

    &__header
        background-color: #333
        display: flex
        justify-content: space-between
        align-items: center

        .v-toolbar__content
            width: 100%

    &__header-inner
        display: flex
        align-items: center
        gap: 8px

    &__input-faculty
        width: 300px

    &__input-direction
        width: 500px

    &__main
        height: 100%

    &__main-inner
        background-color: #444
        padding: 16px
        height: 100%

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
