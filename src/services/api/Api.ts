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

import {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	HttpStatusCode,
} from 'axios'
import axios from './axios'
import { ITokens, IUser } from '@models/Auth'
import tokenService from '@services/auth/TokenService'
import IUploadFileError from '@models/Maps/IUploadFileError'
import { IModule } from '@models/Modules'
import { ICheck, ICheckSettings } from '@models/Check'

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
				Aup: String(aupCode),
			}
		)
	}

	/**
	 * @desc Добавление группы
	 * @param {IGroup} group - Группа
	 * @param {Key} aupCode - АУП-код
	 * @return {Promise<IGroup | null>}
	 */
	static addGroup(group: IGroup, aupCode: Key) {
		console.log(aupCode)

		return this.callFetch<IGroup>(`add-group`, AxiosMethodsEnum.POST, group, {
			Authorization: tokenService.tokens.access || '',
			Aup: String(aupCode),
		})
	}

	/**
	 * @desc Удаление группы
	 * @param {Key} id - ID удаляемой группы
	 * @return {Promise<any | null>}
	 */
	static deleteGroup(id: number, aupCode: Key) {
		return this.callFetch<any>(
			`delete-group`,
			AxiosMethodsEnum.POST,
			{
				id,
			},
			{
				Authorization: tokenService.tokens.access || '',
				Aup: String(aupCode),
			}
		)
	}

	/**
	 * @desc Обновление группы
	 * @param {any} group - Группа
	 * @return {Promise<void | null>}
	 */
	static updateGroup(group: IGroup, aupCode: Key) {
		return this.callFetch<void>(`update-group`, AxiosMethodsEnum.POST, group, {
			Authorization: tokenService.tokens.access || '',
			Aup: String(aupCode),
		})
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
			{
				'Content-Type': 'multipart/form-data',
				Authorization: tokenService.tokens.access || '',
			}
		)
	}

	static async downloadMap(aupCode: Key) {
		return await this.callFetch<any>(
			`save_excel/${aupCode}`,
			AxiosMethodsEnum.GET,
			null,
			null,
			{
				responseType: 'blob',
			}
		)
	}

	static async downloadMapXML(aupCode: Key) {
		return await this.callFetch<any>(`upload-xml/${aupCode}`)
	}

	/**
	 * @desc Запрос на получение модулей
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IModule | null>}
	 */
	static async fetchModuleByAup<T extends IModule[]>(
		aupCode: Key
	): Promise<IApiResponse<T>> {
		if (!aupCode) {
			return {
				data: null,
				status: 400,
				success: false,
			}
		}

		return this.callFetch<T>(`get-modules-by-aup/${aupCode}`)
	}

	/**
	 * @desc Запрос на получение результата теста по аупу
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IModule | null>}
	 */
	static async fetchCheckResultByAup<T extends ICheck>(
		aupCode: Key,
		settings: ICheckSettings,
		abortController: AbortController
	): Promise<IApiResponse<T>> {
		if (!aupCode) {
			return {
				data: null,
				status: 400,
				success: false,
			}
		}

		return this.callFetch<T>(
			`check/${aupCode}?hide_title=${
				!settings.showSuccess || ''
			}&hide_detailed=${!settings.showDetail || ''}`,
			AxiosMethodsEnum.GET,
			null,
			{},
			{
				signal: abortController.signal,
			}
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
		headers?: Record<string, string> | null,
		etc?: AxiosRequestConfig<any>
	): Promise<IApiResponse<T>> {
		try {
			if (headers?.Authorization && endpoint !== 'refresh') {
				const token = headers.Authorization

				if (!token) {
					return {
						success: false,
						status: 403,
						data: null,
					}
				}

				const decoded = jwtDecode<IUser>(token)

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
				...etc,
			})

			return {
				success: true,
				status: res.status,
				data: res.data,
				res,
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
					error: err,
				}
			}

			return {
				success: false,
				status: null,
				data: null,
				error: err,
			}
		}
	}
}

export default Api
