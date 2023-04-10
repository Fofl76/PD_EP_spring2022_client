import { IFacultyRaw, IMapItemRaw, IControlTypeRaw } from '@models/Maps'

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

class MapsService extends Events {
	// 1 зет = 36 часа
	readonly ZETQUEALSHOURS = 36

	private _facultiesList: IFacultiesList = {
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
		const facultiesList = await Api.fetchAllMapsList()

		if (facultiesList) {
			this.setFacultiesList(facultiesList)
			this.emit('fetchMapList', facultiesList)
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
				sum += element?.type?.reduce((sum, zetBlock) => sum + zetBlock?.zet, 0)
			})

			if (sum > maxZet) maxZet = sum
		})

		maxZet = Math.ceil(maxZet)

		return maxZet
	}

	/**
	 * @desc Метод для сохранения всей таблицы
	 * @param {Key} aupCode - Ауп код направления
	 * @return {Promise<void>}
	 */
	async saveAllMap(aupCode: Key, mapList: IMapList[] | null = null) {
		this._isLoadingSaveMapList = true

		const res = await Api.saveMap(
			aupCode,
			mapList || unbuildMapList(this._mapList.value)
		)

		if (res) {
			await this.fetchMapList(aupCode)
		}

		this._isLoadingSaveMapList = false
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
		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col - 1])

		copyColumn.splice(item.num_row, 1)

		const recalculateColumn = getRecalculatedColumn(copyColumn)

		Vue.set(this._mapList.value, item.num_col - 1, recalculateColumn)
	}

	/**
	 * @desc Метод для локального добавления элемтна в колонку
	 * @param {IMapItemRaw} item - Элемент, который необходимо добавить
	 * @param {number} indexColumn - Номер колонки, в которую необходимо добавить
	 * @param {number} indexRow - Номер строки, в которую необходимо добавить
	 * @return {void}
	 */
	addMapItemLocal(item: IMapItemRaw) {
		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col - 1])

		copyColumn.splice(item.num_row, 0, item)

		const recalculateColumn = getRecalculatedColumn(copyColumn)

		Vue.set(this._mapList.value, item.num_col - 1, recalculateColumn)
	}

	/**
	 * @desc Метод для локального перемещения элемента в колонке
	 * @desc Метод для локального перемещения элеметна в колонке
	 * @param {IMapItemRaw} item - Элемент, который необходимо переместить
	 * @param {number} oldIndex - Номер старой строки
	 * @param {number} newIndex - Номер новой строки
	 * @return {void}
	 */

	moveMapItemInColLocal(item: IMapItemRaw, oldIndex: number, newIndex: number) {
		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col - 1])

		copyColumn.splice(oldIndex, 1)

		copyColumn.splice(newIndex, 0, item)

		const recalculateColumn = getRecalculatedColumn(copyColumn)

		Vue.set(this._mapList.value, item.num_col - 1, recalculateColumn)
	}

	async editMapItem(aup, item: IMapItemRaw, newItem: IMapItemRaw) {
		const copyMap = _.cloneDeep(this._mapList.value)

		copyMap[item.num_col + 1][item.num_row] = newItem

		// @ts-ignore
		const res = await this.saveAllMap(aup, unbuildMapList(copyMap))

		console.log(res)

		const copyColumn = _.cloneDeep(this._mapList.value[item.num_col - 1])
		copyColumn[item.num_row] = newItem
		const recalculateColumn = getRecalculatedColumn(copyColumn)
		Vue.set(this._mapList.value, item.num_col - 1, recalculateColumn)
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

	/**
	 * @desc Метод для получения данных таблицы
	 * @return {Promise<void>}
	 */
	async fetchMapList(aupCode: Key) {
		this._isLoadingMapList = true
		const mapList = await Api.fetchMap(aupCode)

		// Вместе с картой загружаем доступный список нагрузок (СРС, Семинарские и т.д.)
		await this.fetchAllControlTypes()

		if (mapList) {
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
		const controlTypes = await Api.fetchAllControlTypes()

		if (controlTypes) {
			this.setAllControlTypes(controlTypes)
			this.emit('fetchAllControlTypes', controlTypes)
		}
	}
}

const mapsService = new MapsService()

export default mapsService
