import {
	IFetchAllMapsListResponse,
	IFetchMapResponse,
	IFetchAllControlTypesResponse,
	IUnitsOfMeasurement,
} from '@models/Maps'
import { IFetchAllGroupsResponse, IGroup } from '@models/Groups'
import Key from '@models/Key'
import jwtDecode from 'jwt-decode'

import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import axios from './axios'
import objectToFormData from '@utils/objectToFormData'
import { ITokenPayload, ITokens, IUser } from '@models/Auth'
import tokenService from '@services/auth/TokenService'
import { IModule } from '@models/Modules'

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
	 * @desc Запрос для авторизации
	 * @param {any} payload - Группа
	 * @return {Promise<ITokens | null>}
	 */
	static login(payload: { username: string; password: string }) {
		return this.callFetch<ITokens>({
			endpoint: 'login',
			method: AxiosMethodsEnum.POST,
			args: payload,
		})
	}

	/**
	 * @desc Запрос для обновления токенов
	 * @return {Promise<void>}
	 */
	static async refresh() {
		const access = tokenService.tokens.access
		const refresh = tokenService.tokens.refresh

		if (!access || !refresh) return

		const data = await this.callFetch<ITokens>({
			endpoint: 'refresh',
			method: AxiosMethodsEnum.POST,
			args: {
				access,
				refresh,
			},
		})

		if (!data) return

		tokenService.emit('tokens-fetched', data)
	}

	static async fetchUser(userId: Key) {
		return this.callFetch<IUser>({
			endpoint: `user/${userId}`,
			method: AxiosMethodsEnum.GET,
			headers: {
				Authorization: tokenService.tokens.access || '',
			},
		})
	}

	/**
	 * @desc Запрос на получение всех дисциплин и факультетов
	 * @return {Promise<IFetchAllMapsListResponse[] | null>}
	 */
	static fetchAllMapsList() {
		return this.callFetch<IFetchAllMapsListResponse[]>({
			endpoint: 'getAllMaps',
		})
	}

	/**
	 * @desc Запрос на получение карты (таблицы)
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IFetchMapResponse | null>}
	 */
	static fetchMap(aupCode: Key) {
		return this.callFetch<IFetchMapResponse>({
			endpoint: `map/${aupCode}`,
		})
	}

	/**
	 * @desc Получение всех групп
	 * @return {Promise<ResponseFetchMap | null>}
	 */
	static fetchAllGroups() {
		return this.callFetch<IFetchAllGroupsResponse[]>({
			endpoint: `getGroups`,
		})
	}

	static fetchUnitsOfMeasurement() {
		return this.callFetch<IUnitsOfMeasurement[]>({
			endpoint: 'get_id_edizm',
		})
	}

	/**
	 * @desc Запрос на получение групп для таблицы
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IFetchMapResponse | null>}
	 */
	static fetchGroupsByAup(aupCode: Key) {
		return this.callFetch<IFetchAllGroupsResponse[]>({
			endpoint: `get-group-by-aup/${aupCode}`,
		})
	}

	/**
	 * @desc Получение всех типов для айтема
	 * @return {Promise<ResponseFetchMap | null>}
	 */
	static fetchAllControlTypes() {
		return this.callFetch<IFetchAllControlTypesResponse[]>({
			endpoint: `getControlTypes`,
		})
	}

	/**
	 * @desc Сохранение карты
	 * @param {Key} aupCode - Номер карты
	 * @param {any[]} table - Объект данных с картой
	 * @return {Promise<any | null>}
	 */
	static saveMap(aupCode: Key, table: any[]) {
		return this.callFetch<any>({
			endpoint: `save/${aupCode}`,
			method: AxiosMethodsEnum.POST,
			args: table,
			headers: {
				Authorization: tokenService.tokens.access || '',
			},
		})
	}

	/**
	 * @desc Добавление группы
	 * @param {any} group - Группа
	 * @return {Promise<IGroup | null>}
	 */
	static addGroup(group: IGroup) {
		return this.callFetch<IGroup>({
			endpoint: `add-group`,
			method: AxiosMethodsEnum.POST,
			args: group,
		})
	}

	/**
	 * @desc Удаление группы
	 * @param {Key} id - ID удаляемой группы
	 * @return {Promise<any | null>}
	 */
	static deleteGroup(id: number) {
		return this.callFetch<any>({
			endpoint: `delete-group`,
			method: AxiosMethodsEnum.POST,
			args: {
				id,
			},
		})
	}

	/**
	 * @desc Обновление группы
	 * @param {any} group - Группа
	 * @return {Promise<void | null>}
	 */
	static updateGroup(group: IGroup) {
		return this.callFetch<void>({
			endpoint: `update-group`,
			method: AxiosMethodsEnum.POST,
			args: group,
		})
	}

	/**
	 * @desc Загрузка файла с дисциплинами
	 * @param {IFormUpload} group - Группа
	 * @return {Promise<Key | null>}
	 */
	static uploadFile(form: IFormUpload) {
		return this.callFetch<Key>({
			endpoint: `upload`,
			method: AxiosMethodsEnum.POST,
			args: objectToFormData(form),
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}

	/**
	 * @desc Запрос на получение модулей
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IModule | null>}
	 */
	static fetchModuleByAup(aupCode: Key) {
		return this.callFetch<IModule[]>({
			endpoint: `get-modules-by-aup/${aupCode}`,
		})
	}

	/**
	 * @desc Приватный общий метод для вызова запросов axios
	 * @param {string} endpoint - Название энпдоинта на который отправляется запрос
	 * @param {AxiosMethodsEnum = AxiosMethodsEnum.GET} method - Метод для вызова в axios
	 * @param {any} args - Тело запроса
	 * @param {Record<string, string>} headers - Заголовки запроса
	 * @return {Promise<T | undefined>} Промис
	 */
	private static async callFetch<T = any>({
		endpoint,
		method = AxiosMethodsEnum.GET,
		args,
		headers,
	}: {
		endpoint: string
		method?: AxiosMethodsEnum
		args?: any
		headers?: Record<string, string>
	}): Promise<T | null> {
		try {
			if (headers?.Authorization && endpoint !== 'refresh') {
				const token = headers.Authorization

				if (!token) {
					return null
				}

				const decoded = jwtDecode<ITokenPayload>(token)

				if (decoded.exp * 1000 < Date.now()) {
					await this.refresh()
					headers.Authorization = tokenService.tokens.access!
				}
			}

			const res: AxiosResponse<T> = await axios(endpoint, {
				method,
				data: args,
				headers: {
					...headers,
				},
			})

			return res.data
		} catch (e) {
			if (
				endpoint === 'refresh' &&
				(e as AxiosError).response?.status === HttpStatusCode.Unauthorized
			) {
				tokenService.emit('logout')
			}

			return null
		}
	}
}

export default Api
