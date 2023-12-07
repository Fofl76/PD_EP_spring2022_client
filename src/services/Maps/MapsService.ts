import {
	IFacultyRaw,
	IMapItemRaw,
	IControlTypeRaw,
	IUnitsOfMeasurement,
} from '@models/Maps'
import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'

import Api from '@services/api/Api'

import _ from 'lodash'
import Events from 'events'
import Vue from 'vue'

import getRecalculatedColumn from './getRecalculatedColumn'
import buildMapList from './buildMapsList'
import unbuildMapList from './unbuildMapsList'
import Key from '@models/Key'

interface IControlTypesList {
	value: IControlTypeRaw[]
}

interface IFacultiesList {
	value: IFacultyRaw[]
}

interface IMapList {
	value: IMapItemRaw[][]
}

interface IUnitsOfMeasurementList {
	value: IUnitsOfMeasurement[]
}

class MapsService extends Events {
	// 1 зет = 36 часа
	readonly ZETQUEALSHOURS = 36

	// 1 неделя = 1,5 зет
	readonly WEEKQUEALSZET = 1.5

	// 1 неделя = 54 часа
	readonly WEEKQUEALSHOURS = 54

	private _facultiesList: IFacultiesList = {
		value: [],
	}

	private _unitsOfMeasurement: IUnitsOfMeasurementList = {
		value: [],
	}

	private _controlTypes: IControlTypesList = {
		value: [],
	}

	private _isLoadingFacultiesList = false

	/**
	 * @desc Геттер для получения всеех дисциплин и факультетов
	 * @return {IFaculty[]}
	 */
	get facultiesList() {
		return new Proxy(this._facultiesList, {
			set() {
				throw new Error('is readonly')
			},
		})
	}

	get unitsOfMeasurement() {
		return new Proxy(this._unitsOfMeasurement, {
			set() {
				throw new Error('is readonly')
			},
		})
	}

	get isLoadingFacultiesList() {
		return this._isLoadingFacultiesList
	}

	/**
	 * @desc Метод для записи дисциплин и факультетов
	 * @param {IFaculty[]} newList - Новый список дисциплин и факультетов
	 * @return {void}
	 */
	setFacultiesList(newList: IFacultyRaw[]) {
		this._facultiesList.value = newList
		this.emit('setFacultiesList', newList)
	}

	/**
	 * @desc Метод для получения всех дисциплин и факультетов
	 * @return {Promise<void>}
	 */
	async fetchFacultiesList() {
		const { success, data } = await Api.fetchAllMapsList()

		if (success && data) {
			this.setFacultiesList(data)
			this.emit('fetchMapList', data)
		}
	}

	private _mapList = {
		value: [],
	} as IMapList
	private _isLoadingMapList = false
	private _isLoadingSaveMapList = false

	/**
	 * @desc Геттер для получения массива элементов
	 * @return {IMapItemRaw[]}
	 */
	get mapList() {
		return new Proxy(this._mapList, {
			set() {
				throw new Error('is readonly')
			},
		})
	}

	get controlTypes() {
		return new Proxy(this._controlTypes, {
			set() {
				throw new Error('is readonly')
			},
		})
	}

	/**
	 * @desc Геттер для получения статуса загрузки
	 * @return {boolean}
	 */
	get isLoadingMapList() {
		return this._isLoadingMapList
	}

	/**
	 * @desc Геттер для получения статуса сохранения
	 * @return {boolean}
	 */
	get isLoadingSaveMapList() {
		return this._isLoadingSaveMapList
	}

	/**
	 * @desc Геттер для получения максимального кол-ва ЗЕТ среди всех колонок
	 * @return {number}
	 */
	get maxZet() {
		let maxZet = 0

		this.mapList.value.forEach(column => {
			let sum = 0
			column.forEach(element => {
				sum += element?.type?.value?.reduce((sum, zetBlock) => {
					if (zetBlock.amount_type === ValueAmountTypeEnum.WEEK) {
						return sum + zetBlock.amount * this.WEEKQUEALSHOURS
					}

					return sum + zetBlock.amount
				}, 0)
			})

			if (sum > maxZet) maxZet = sum
		})

		maxZet = Math.ceil(maxZet / this.ZETQUEALSHOURS)

		return maxZet
	}

	/**
	 * @desc Метод для сохранения всей таблицы
	 * @param {Key} aupCode - Ауп код направления
	 * @return {Promise<void>}
	 */
	async saveAllMap(aupCode: Key, mapList: IMapItemRaw[] | null = null) {
		this._isLoadingSaveMapList = true

		const { success, data } = await Api.saveMap(
			aupCode,
			mapList || unbuildMapList(this._mapList.value)
		)

		if (success) {
			await this.fetchMapList(aupCode)
		}

		this._isLoadingSaveMapList = false

		return data
	}

	getMapItemById(id: string): IMapItemRaw | null {
		return this._mapList.value.flat().find(item => item.id === id) || null
	}

	/**
	 * @desc Метод для локального удаления элемтна с колонке
	 * @param {IMapItemRaw} item - Элемент, который необходимо удалить
	 * @return {void}
	 */
	deleteMapItemLocal(item: IMapItemRaw) {
		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col])

		copyColumn.splice(item.num_row, 1)

		const recalculateColumn = getRecalculatedColumn(copyColumn)

		Vue.set(this._mapList.value, item.num_col, recalculateColumn)
	}

	/**
	 * @desc Метод для локального добавления элемента в колонку
	 * @param {IMapItemRaw} item - Элемент, который необходимо добавить
	 * @param {number} indexColumn - Номер колонки, в которую необходимо добавить
	 * @param {number} indexRow - Номер строки, в которую необходимо добавить
	 * @return {void}
	 */
	addMapItemLocal(item: IMapItemRaw) {
		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col])

		copyColumn.splice(item.num_row, 0, item)

		const recalculateColumn = getRecalculatedColumn(copyColumn)

		Vue.set(this._mapList.value, item.num_col, recalculateColumn)
	}

	/**
	 * @desc Метод для локального перемещения элемента в колонке
	 * @param {IMapItemRaw} item - Элемент, который необходимо переместить
	 * @param {number} oldIndex - Номер старой строки
	 * @param {number} newIndex - Номер новой строки
	 * @return {void}
	 */

	moveMapItemInColLocal(item: IMapItemRaw, oldIndex: number, newIndex: number) {
		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col])

		copyColumn.splice(oldIndex, 1)

		copyColumn.splice(newIndex, 0, item)

		const recalculateColumn = getRecalculatedColumn(copyColumn)

		Vue.set(this._mapList.value, item.num_col, recalculateColumn)
	}

	async editMapItem(aup, item: IMapItemRaw, newItem: IMapItemRaw) {
		const copyMap = _.cloneDeep(this._mapList.value)

		copyMap[item.num_col][item.num_row] = newItem

		console.log(copyMap[item.num_col][item.num_row])

		const res = await this.saveAllMap(aup, unbuildMapList(copyMap))

		if (res) {
			const copyColumn = _.cloneDeep(this._mapList.value[item.num_col])
			copyColumn[item.num_row] = newItem
			const recalculateColumn = getRecalculatedColumn(copyColumn)
			Vue.set(this._mapList.value, item.num_col, recalculateColumn)

			return res
		}
	}

	/**
	 * @desc Метод для записи списка групп
	 * @param {IMapItemRaw[]} newList - Новый список
	 * @return {void}
	 */
	setMapList(newList: IMapItemRaw[]) {
		this._mapList.value = buildMapList(newList)
		this.emit('onUpdatedMapList', newList)
	}

	convertHoursToZet(
		hours: number,
		unitOfMeasurement: ValueAmountTypeEnum = ValueAmountTypeEnum.HOUR
	) {
		if (unitOfMeasurement === ValueAmountTypeEnum.WEEK)
			return hours * this.WEEKQUEALSZET
		return hours / this.ZETQUEALSHOURS
	}
	convertZetToHours(
		zet: number,
		unitOfMeasurement: ValueAmountTypeEnum = ValueAmountTypeEnum.HOUR
	) {
		if (unitOfMeasurement === ValueAmountTypeEnum.WEEK)
			return zet / this.WEEKQUEALSZET
		return zet * this.ZETQUEALSHOURS
	}

	/**
	 * @desc Метод для получения данных таблицы
	 * @return {Promise<void>}
	 */
	async fetchMapList(aupCode: Key) {
		this._isLoadingMapList = true
		const { success, data: mapList } = await Api.fetchMap(aupCode)

		// Вместе с картой загружаем доступный список нагрузок (СРС, Семинарские и т.д.)
		await this.fetchAllControlTypes()

		if (success && mapList) {
			this.setMapList(mapList.data)
			this.emit('fetchMapList', mapList.data)
		}

		this._isLoadingMapList = false
	}

	setAllControlTypes(controlTypes: IControlTypeRaw[]) {
		this._controlTypes.value = controlTypes
		this.emit('setAllControlTypes', controlTypes)
	}

	async fetchAllControlTypes() {
		const { success, data } = await Api.fetchAllControlTypes()

		if (success && data) {
			this.setAllControlTypes(data)
			this.emit('fetchAllControlTypes', data)
		}
	}

	setUnitsOfMeasurement(items: IUnitsOfMeasurement[]) {
		this._unitsOfMeasurement.value = items
	}

	async fetchUnitsOfMeasurement() {
		const { success, data } = await Api.fetchUnitsOfMeasurement()

		if (success && data) {
			this.setUnitsOfMeasurement(data)
		}
	}
}

const mapsService = new MapsService()

export default mapsService
