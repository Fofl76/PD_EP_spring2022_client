import _ from 'lodash'
import Api from '@api/Api'
import { IGroup } from '@models/Grops'
import Events from 'events'

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