import {
	IFetchAllMapsListResponse,
	IFetchMapResponse,
	IFetchAllControlTypesResponse,
	IUnitsOfMeasurement,
} from '@models/Maps'
import { IFetchAllGroupsResponse, IGroup } from '@models/Grops'
import Key from '@models/Key'

import { AxiosResponse } from 'axios'
import axios from './axios'
import objectToFormData from '@utils/objectToFormData'

enum AxiosMethodsEnum {
	GET = 'GET',
	POST = 'POST',
}

interface IFormUpload {
	file: File
	options: {
		enableCheckIntegrality: boolean
		enableCheckSumMap: boolean
	}
}

abstract class Api {
	/**
	 * @desc Запрос на получение всех дисциплин и факультетов
	 * @return {Promise<IFetchAllMapsListResponse[] | null>}
	 */
	static fetchAllMapsList() {
		return this.callFetch<IFetchAllMapsListResponse[]>('getAllMaps')
	}

	/**
	 * @desc Запрос на получение карты (таблицы)
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IFetchMapResponse | null>}
	 */
	static fetchMap(aupCode: Key) {
		return this.callFetch<IFetchMapResponse>(`map/${aupCode}`)
	}

	/**
	 * @desc Получение всех групп
	 * @return {Promise<ResponseFetchMap | null>}
	 */
	static fetchAllGroups() {
		return this.callFetch<IFetchAllGroupsResponse[]>(`getGroups`)
	}

	static fetchUnitsOfMeasurement () {
		return this.callFetch<IUnitsOfMeasurement[]>('get_id_edizm')
	}

	/**
	 * @desc Запрос на получение групп для таблицы
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IFetchMapResponse | null>}
	 */
	static fetchGroupsByAup(aupCode: Key) {
		return this.callFetch<IFetchAllGroupsResponse[]>(`get-group-by-aup/${aupCode}`)
	}

	/**
	 * @desc Получение всех типов для айтема
	 * @return {Promise<ResponseFetchMap | null>}
	 */
	static fetchAllControlTypes() {
		return this.callFetch<IFetchAllControlTypesResponse[]>(`getControlTypes`)
	}

	/**
	 * @desc Сохранение карты
	 * @param {Key} aupCode - Номер карты
	 * @param {any[]} table - Объект данных с картой
	 * @return {Promise<any | null>}
	 */
	static saveMap(aupCode: Key, table: any[]) {
		return this.callFetch<any>(`save/${aupCode}`, AxiosMethodsEnum.POST, table)
	}

	/**
	 * @desc Добавление группы
	 * @param {any} group - Группа
	 * @return {Promise<IGroup | null>}
	 */
	static addGroup(group: IGroup) {
		return this.callFetch<IGroup>(`add-group`, AxiosMethodsEnum.POST, group)
	}

	/**
	 * @desc Удаление группы
	 * @param {Key} id - ID удаляемой группы
	 * @return {Promise<any | null>}
	 */
	static deleteGroup(id: number) {
		return this.callFetch<any>(`delete-group`, AxiosMethodsEnum.POST, {
			id,
		})
	}

	/**
	 * @desc Обновление группы
	 * @param {any} group - Группа
	 * @return {Promise<void | null>}
	 */
	static updateGroup(group: IGroup) {
		return this.callFetch<void>(`update-group`, AxiosMethodsEnum.POST, group)
	}

	/**
	 * @desc Загрузка файла с дисциплинами
	 * @param {IFormUpload} group - Группа
	 * @return {Promise<Key | null>}
	 */
	static uploadFile(form: IFormUpload) {
		return this.callFetch<Key>(
			`upload`,
			AxiosMethodsEnum.POST,
			objectToFormData(form),
			{ 'Content-Type': 'multipart/form-data' }
		)
	}

	/**
	 * @desc Приватный общий метод для вызова запросов axios
	 * @param {string} endpoint - Название энпдоинта на который отправляется запрос
	 * @param {AxiosMethodsEnum = AxiosMethodsEnum.GET} method - Метод для вызова в axios
	 * @param {any} args - Тело запроса
	 * @param {Record<string, string>} headers - Заголовки запроса
	 * @return {Promise<T | undefined>} Промис
	 */
	private static async callFetch<T = any>(
		endpoint: string,
		method: AxiosMethodsEnum = AxiosMethodsEnum.GET,
		args?: any,
		headers?: Record<string, string>
	): Promise<T | null> {
		try {
			const res: AxiosResponse<T> = await axios(endpoint, {
				method,
				data: args,
				headers,
			})

			const data = res.data

			return data
		} catch (e) {
			console.log(e)
			return null
		}
	}
}

export default Api
