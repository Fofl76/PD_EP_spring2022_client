<template>
	<div class="Home">
		<header class="Home__header">
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

			<v-btn
				v-if="isReady"
				:href="`http://127.0.0.1:5000/save/${aupCode}`"
				target="_blank"
				text
				dark
			>
				Скачать
				<v-icon right dark> mdi-download </v-icon>
			</v-btn>
		</header>

		<main class="Home__main">
			<div v-if="isReady" class="aup-table" :style="styleVars">
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

				<div
					class="aup-table__column"
					v-for="(column, key) in table"
					:key="key"
				>
					<div class="aup-table__column-header">{{ orderWords[key] }}</div>

					<draggable
						class="list-group"
						v-bind="dragOptions"
						v-model="table[key]"
						@change="onChangeTable"
						:setData="setData"
					>
						<div v-for="element in column" :key="element.id">
							<div
								class="aup-table__block-wrapper"
								:style="{ height: element.zet * 90 + 'px' }"
							>
								<div
									class="aup-table__block"
									:style="{ backgroundColor: element.disc_color }"
								>
									{{ element.discipline }}
								</div>
							</div>
						</div>
					</draggable>
				</div>
			</div>

			<div v-else class="Home__nodata-block">Нет данных</div>
		</main>

		<v-btn
			v-if="isAvailableSave"
			class="Home__save-table-btn"
			color="success"
			dark
			@click="onSaveMap"
		>
			<span>Сохранить</span>
			<v-icon right dark> mdi-content-save </v-icon>
		</v-btn>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import _ from 'lodash'

export default {
	name: 'Home',
	components: { draggable },

	data: () => ({
		mapsList: [],
		availableDirections: [],

		aupCode: null,
		isAvailableSave: false,

		faculties: [],
		value: null,
		maxZet: 30,
		table: [],
		drag: false,

		orderWords: {
			0: 'Первый',
			1: 'Второй',
			2: 'Третий',
			3: 'Четвертый',
			4: 'Пятый',
			5: 'Шестой',
			6: 'Седьмой',
			7: 'Восьмой',
		},
	}),

	computed: {
		countOfColumns() {
			return Object.keys(this.table).length
		},

		styleVars() {
			return {
				'--count-column': this.countOfColumns,
			}
		},

		dragOptions() {
			return {
				animation: 250,
				group: 'map',
			}
		},

		isReady() {
			return this.table.length
		},
	},

	methods: {
		onChangeTable() {
			this.isAvailableSave = true
		},

		onSelectFaculty(faculty) {
			this.availableDirections = faculty.data
		},

		async onSelectDirection(direction) {
			await this.fetchMap(direction.map_id)
		},

		buildTable(data) {
			const columns = _.groupBy(data, 'num_col')
			const sortedColumns = _.sortBy(columns, ['num_row'])

			this.table = sortedColumns
		},

		clearTable() {
			this.table = []
			this.aupCode = null
			this.isAvailableSave = false
		},

		async fetchAllMapsList() {
			const res = await fetch('http://127.0.0.1:5000/getAllMaps')
			const data = await res.json()

			this.mapsList = data
		},

		async fetchMap(aupCode) {
			try {
				const res = await fetch(`http://127.0.0.1:5000/map/${aupCode}`)
				const data = await res.json()
				this.aupCode = aupCode

				this.buildTable(data.data)
			} catch (e) {
				this.clearTable()
			}
		},

		async onSaveMap() {
			const table = this.table.map((column, colId) => {
				return column.map((block, rowId) => {
					return {
						...block,
						num_col: colId,
						num_row: rowId,
					}
				})
			})

			console.log(JSON.stringify(table))
		},

		setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},
	},

	async created() {
		this.faculties = [
			{
				value: 1,
				label: 'Факультет информационных технологий',
			},
			{
				value: 2,
				label: 'Транспортный факультет',
			},
			{
				value: 3,
				label: 'Факультет машиностроения',
			},
			{
				value: 4,
				label: 'Факультет химической технологии и биотехнологии',
			},
		]

		this.directions = [
			{
				value: 1,
				label: 'Мобильные технологии',
			},
			{
				value: 2,
				label: 'Цифровая трансформация',
			},
			{
				value: 3,
				label: 'Интеграция и программирование в САПР',
			},
			{
				value: 4,
				label: 'Безопасность компьютерных систем',
			},
		]

		this.fetchAllMapsList()
	},
}
</script>

<style lang="sass">
.Home
    display: grid
    grid-template-rows: 80px 1fr
    height: 100%

    &__header
        padding: 0 16px
        background-color: #333
        display: flex
        justify-content: space-between
        align-items: center

    &__header-inner
        display: flex
        align-items: center
        gap: 8px

    &__input-faculty
        width: 300px

    &__input-direction
        width: 500px

    &__main
        padding: 16px
        background-color: #444
        height: 100%

    &__nodata-block
        color: #fff

    &__save-table-btn
        position: fixed
        bottom: 30px
        right: 30px

.aup-table
    display: grid
    grid-template-columns: 30px repeat(var(--count-column), minmax(100px, 1fr))
    gap: 8px
    color: #fff

.aup-table__block-wrapper
    padding: 5px 0

.aup-table__block
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

.aup-table__column-header
    text-align: center
    margin-bottom: 5px

.aup-table__zet-block
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
