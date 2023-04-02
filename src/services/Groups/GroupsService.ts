import _ from 'lodash'
import Api from '@api/Api'
import { IGroup } from '@models/Grops'
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
      }
    })
  }

  /**
	 * @desc Геттер для получения объекта {[id_group]: group}
	 * @return {Record<<number>, IGroup>}
	 */
  get allGroupsMapId() {
    return new Proxy(_.keyBy(this._groupsList.value, group => group.id), {
      set() {
        throw new Error('is readonly')
      }
    })
  }

  addGroupLocal(group: IGroup) {
    this._groupsList.value.push(group)
  }

  async addGroup(group: IGroup) {
    const res = await Api.addGroup(group)

    if (res) {
      this.addGroupLocal(res)
      return res
    }
  }

  async deleteGroupLocal(idGroup: number) {
    this._groupsList.value = this._groupsList.value.filter(el => el.id !== idGroup)
  }

  async deleteGroup(idGroup: number) {
    const res = await Api.deleteGroup(idGroup)

    if (res) {
      this.deleteGroupLocal(idGroup)
    }
  }

  updateGroupLocal(group: IGroup) {
    const indexGroup = _.findIndex(this._groupsList.value, function (el) {
      console.log(el.id, group.id);
      
      return el.id === group.id
    })

    console.log(indexGroup);
    

    Vue.set(this._groupsList.value, indexGroup, group)
  }

  async updateGroup(group: IGroup) {
    const res = await Api.updateGroup(group)

    if (res) {
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
    const res = await Api.fetchAllGroups()

    if (res) {
      this.setGroupsList(res)
    }
  }
}

const groupsService = new GroupsService()

export default groupsService