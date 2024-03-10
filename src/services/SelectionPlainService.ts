import Key from '@models/Key'

import Events from 'events'
import convertToArray from '@utils/convertToArray'

import Vue from 'vue'

class SelectionPlainService extends Events {
	selectedItems = Vue.observable({})

	idKey: Key = null!

	constructor(selectedItems: Key[] = [], idKey: Key = 'id') {
		super()
		this.idKey = idKey
		this.select(selectedItems)
	}

	select(ids: Key | Key[]) {
		ids = convertToArray(ids)

		ids.forEach(id => Vue.set(this.selectedItems, id, id))

		this.emit('select', ids)

		console.log('select', ids)

		return ids
	}

	unselect(ids: Key | Key[]) {
		ids = convertToArray(ids)
		ids.forEach(id => Vue.delete(this.selectedItems, id))

		this.emit('unselect', ids)

		console.log('unselect', ids)

		return ids
	}

	switch(ids: Key | Key[]) {
		ids = convertToArray(ids)

		ids.forEach(id => {
			if (this.isSelected(id)) this.unselect(id)
			else this.select(ids)
		})
	}

	isSelected(id: Key) {
		return Object.prototype.hasOwnProperty.call(this.selectedItems, id)
	}

	hasSelectedItems() {
		return Object.keys(this.selectedItems).length > 0
	}

	clear() {
		this.selectedItems = Vue.observable({})

		this.emit('clear')
	}
}

Object.defineProperty(window, '_SelectionPlainService', {
	value: SelectionPlainService,
})

export default SelectionPlainService
