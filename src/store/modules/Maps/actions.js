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

export const saveMap = async ({ getters, commit }, table = null) => {
	try {
		commit('setIsLoadingSaveTable', true)

		const activeTableMap = table || getters.activeMapTable

		const res = await axios.post(`save/${getters.activeAupCode}`, activeTableMap)
		return res
	} catch (e) {
		console.log(e)
	} finally {
		commit('setIsLoadingSaveTable', false)
	}
}


export const addGroup = async ({commit}, group) => {
	try {
		const res = await axios.post(`add-group`, group)

		if (res.status === 200) {
			commit('addGroups', {
				...group,
				id: res.data.id
			})
		}
	} catch (e) {
		console.log(e);
	}
}

export const deleteGroup = async ({commit}, id) => {
	try {
		const res = await axios.post(`delete-group`, {
			id,
		})

		commit('deleteGroup', id)
		
	} catch (e) {
		console.log(e)
	}
}

export const updateGroup = async ({commit}, group) => {
	try {
		const res = await axios.post(`update-group`, group)

		commit('updateGroup', group)
		
	} catch (e) {
		console.log(e)
	}
}