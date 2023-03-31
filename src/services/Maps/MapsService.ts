import { IMaps } from '@models/Maps'
import Api from '@api/Api'
import Events from 'events'

interface Value {
	mapsList: IMaps[]
}

class MapsService extends Events {
	value: Value = {
		mapsList: [],
	}

	setMapList(newList: IMaps[]) {
		this.value.mapsList = newList
		this.emit('test', 'asdfasef')
	}

	async fetchMapList() {
		try {
			const mapsList = await Api.fetchAllMapsList()

			if (mapsList) {
				this.setMapList(mapsList)
			}
		} catch (error) {
			console.log(error)
		}
	}
}

const mapsService = new MapsService()

export default mapsService
