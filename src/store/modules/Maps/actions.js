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

export const fetchMap = async ({ commit }, aupCode) => {
	try {
		commit('setIsLoadingTable', true)

		const res = await axios.get(`map/${aupCode}`)
		const data = res.data

		commit('setActiveMapTable', data.data)

		return data
	} catch (e) {
		console.log(e)
		return []
	} finally {
		commit('setIsLoadingTable', false)
	}
}

export const fetchAllGroups = async ({ commit }) => {
	try {
		commit('setIsLoadingGroups', true)

		const res = await axios.get(`getGroups`)
		const data = res.data

		commit('setAllGroups', data)
	} catch (e) {
		console.log(e)
	} finally {
		commit('setIsLoadingGroups', false)
	}
}
