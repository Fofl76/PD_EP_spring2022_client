import {
	IFetchAllMapsListResponse,
	IFetchMapResponse,
	IFetchAllControlTypesResponse,
	IUnitsOfMeasurement,
} from '@models/Maps'
import { IFetchAllGroupsResponse, IGroup } from '@models/Groups'
import { IApiResponse } from '@models/Api'
import Key from '@models/Key'
import jwtDecode from 'jwt-decode'

import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import axios from './axios'
import objectToFormData from '@utils/objectToFormData'
import { ITokenPayload, ITokens, IUser } from '@models/Auth'
import tokenService from '@services/auth/TokenService'
import authService from '@services/auth/AuthService'
import IUploadFileError from '@models/Maps/IUploadFileError'

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
		return this.callFetch<ITokens>('login', AxiosMethodsEnum.POST, payload)
	}

	/**
	 * @desc Запрос для обновления токенов
	 * @return {Promise<void>}
	 */
	static async refresh() {
		const access = tokenService.tokens.access
		const refresh = tokenService.tokens.refresh

		if (!access || !refresh) return

		const { success, data } = await this.callFetch<ITokens>(
			'refresh',
			AxiosMethodsEnum.POST,
			{
				access,
				refresh,
			}
		)

		if (success && data) tokenService.emit('tokens-fetched', data)
	}

	static async fetchUser(userId: Key) {
		return this.callFetch<IUser>(`user/${userId}`, AxiosMethodsEnum.GET, null, {
			Authorization: tokenService.tokens.access || '',
		})
	}

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

	static fetchUnitsOfMeasurement() {
		return this.callFetch<IUnitsOfMeasurement[]>('get_id_edizm')
	}

	/**
	 * @desc Запрос на получение групп для таблицы
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IFetchMapResponse | null>}
	 */
	static fetchGroupsByAup(aupCode: Key) {
		return this.callFetch<IFetchAllGroupsResponse[]>(
			`get-group-by-aup/${aupCode}`
		)
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
		return this.callFetch<any>(
			`save/${aupCode}`,
			AxiosMethodsEnum.POST,
			table,
			{
				Authorization: tokenService.tokens.access || '',
			}
		)
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
	static uploadFile(form: IFormUpload[]) {
		return this.callFetch<Key | IUploadFileError>(
			`upload`,
			AxiosMethodsEnum.POST,
			form,
			{ 'Content-Type': 'multipart/form-data' }
		)
	}

	static async downloadMap(aupCode: Key) {
		return await this.callFetch<any>(`save_excel/${aupCode}`)
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
	): Promise<IApiResponse<T>> {
		try {
			console.log('endpoint', args)

			if (headers?.Authorization && endpoint !== 'refresh') {
				const token = headers.Authorization

				if (!token) {
					return {
						success: false,
						status: 403,
						data: null,
					}
				}

				const decoded = jwtDecode<ITokenPayload>(token)

				if (decoded.exp * 1000 < Date.now()) {
					await this.refresh()
					headers.Authorization = tokenService.tokens.access!
				}
			}

			const { status, data }: AxiosResponse<T> = await axios(endpoint, {
				method,
				data: args,
				headers: {
					...headers,
				},
			})

			return {
				success: true,
				status,
				data,
			}
		} catch (err) {
			if (err instanceof AxiosError && err.response) {
				const { data, status }: AxiosResponse = err.response

				if (endpoint === 'refresh' && status === HttpStatusCode.Unauthorized) {
					tokenService.emit('logout')
				}

				return {
					success: false,
					status,
					data,
				}
			}

			return {
				success: false,
				status: null,
				data: null,
			}
		}
	}
}

export default Api
