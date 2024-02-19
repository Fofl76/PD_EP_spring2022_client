import _ from 'lodash'
import Api from '@api/Api'
import Key from '@models/Key'
import { IGroup } from '@models/Groups'
import Events from 'events'
import Vue from 'vue'

interface IGroupsList {
	value: IGroup[]
}

class GroupsService extends Events {
	private _groupsList = {
		value: [],
	} as IGroupsList

	/**
	 * @desc Геттер для получения списка групп
	 * @return {IGroupsList}
	 */
	get groupsList() {
		return new Proxy(this._groupsList, {
			set() {
				throw new Error('is readonly')
			},
		})
	}

	/**
	 * @desc Геттер для получения объекта {[id_group]: group}
	 * @return {Record<<number>, IGroup>}
	 */
	get allGroupsMapId() {
		return new Proxy(
			_.keyBy(this._groupsList.value, group => group.id),
			{
				set() {
					throw new Error('is readonly')
				},
			}
		)
	}

	addGroupLocal(group: IGroup) {
		this._groupsList.value.push(group)
	}

	async addGroup(group: IGroup, aupCode: Key) {
		const { data, success } = await Api.addGroup(group, aupCode)

		if (success && data) {
			this.addGroupLocal(data)
			return data
		}
	}

	async deleteGroupLocal(idGroup: number) {
		this._groupsList.value = this._groupsList.value.filter(
			el => el.id !== idGroup
		)
	}

	async deleteGroup(idGroup: number, aupCode: Key) {
		const { success } = await Api.deleteGroup(idGroup, aupCode)

		if (success) {
			this.deleteGroupLocal(idGroup)
		}
	}

	updateGroupLocal(group: IGroup) {
		const indexGroup = _.findIndex(this._groupsList.value, function (el) {
			return el.id === group.id
		})

		Vue.set(this._groupsList.value, indexGroup, group)
	}

	async updateGroup(group: IGroup, aupCode: Key) {
		const { success } = await Api.updateGroup(group, aupCode)

		if (success) {
			this.updateGroupLocal(group)
		}
	}

	/**
	 * @desc Метод для записи списка групп
	 * @param {IGroup[]} newList - Новый список
	 * @return {Promise<void>}
	 */
	setGroupsList(newList: IGroup[]) {
		this._groupsList.value = newList
	}

	/**
	 * @desc Метод для получения всех групп
	 * @return {Promise<void>}
	 */
	async fetchAllGroups() {
		const { success, data } = await Api.fetchAllGroups()

		if (success && data) {
			this.setGroupsList(data)
		}
	}
}

const groupsService = new GroupsService()

Object.defineProperty(window, '_groupsService', { value: groupsService })

export default groupsService
