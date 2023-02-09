import axios from '@api/axios'

export const fetchAllMapsList = async ({ commit }) => {
	try {
		const res = await axios.get('getAllMaps')
		const data = res.data

		commit('setMapsList', data)
	} catch (e) {
		return []
	}
}
