import Vue from 'vue'
import _ from 'lodash'
import Events from 'events'

import Api from '@api/Api'

import type { IModule } from '@models/Modules'
import type { Key } from '@models/Key'

interface IModulesList {
	value: IModule[]
}

class ModulesService extends Events {
	private _modulesList: IModulesList = {
		value: [],
	}

	/**
	 * @desc Геттер для получения списка модулей
	 * @return {IModulesList}
	 */
	get modulesList() {
		return new Proxy(this._modulesList, {
			set() {
				throw new Error('is readonly')
			},
		})
	}

	/**
	 * @desc Геттер для получения объекта {[id_module]: module}
	 * @return {Record<<number>, IModule>}
	 */
	get allModulesMapId() {
		return new Proxy(
			_.keyBy(this._modulesList.value, module => module.id),
			{
				set() {
					throw new Error('is readonly')
				},
			},
		)
	}

	addModuleLocal(module: IModule) {
		this._modulesList.value.push(module)
	}

	async addModule(module: IModule) {
		const { data, success } = await Api.addModule(module)

		if (success && data) {
			this.addModuleLocal(data)
			return data
		}
	}

	async deleteModuleLocal(idModule: number) {
		this._modulesList.value = this._modulesList.value.filter(
			el => el.id !== idModule,
		)
	}

	async deleteModule(idModule: number) {
		const { success } = await Api.deleteModule(idModule)

		if (success) {
			this.deleteModuleLocal(idModule)
		}
	}

	updateModuleLocal(module: IModule) {
		const index = _.findIndex(this._modulesList.value, function (el) {
			return el.id === module.id
		})

		Vue.set(this._modulesList.value, index, module)
	}

	async updateModule(module: IModule) {
		const { success } = await Api.updateModule(module)

		if (success) {
			this.updateModuleLocal(module)
		}
	}

	/**
	 * @desc Метод для записи списка модулей
	 * @param {IModule[]} newList - Новый список
	 * @return {Promise<void>}
	 */
	setModulesList(newList: IModule[]) {
		this._modulesList.value = newList
	}

	/**
	 * @desc Метод для получения всех модулей
	 * @return {Promise<void>}
	 */
	async fetchAllModules() {
		const { success, data } = await Api.fetchAllModules()

		if (success && data) {
			this.setModulesList(data.filter(e => e.name))
		}
	}

	/**
	 * @desc Метод для получения модулей по аупу
	 * @return {Promise<IModule[] | null>}
	 */
	async fetchModulesByAup(aupCode: Key) {
		const { data } = await Api.fetchModuleByAup(aupCode)

		return data
	}
}

const modulesService = new ModulesService()

Object.defineProperty(window, '_modulesService', { value: modulesService })

export default modulesService
