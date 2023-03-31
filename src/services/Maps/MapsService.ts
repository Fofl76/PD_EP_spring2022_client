import { IMaps } from '@models/Maps'
import Api from '@api/Api'

interface Value {
	mapsList: IMaps[]
}

class MapsService {
	value: Value = {
		mapsList: [],
	}

	setMapList(newList: IMaps[]) {
		this.value.mapsList = newList
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
