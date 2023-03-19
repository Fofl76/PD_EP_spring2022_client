import _ from 'lodash'

export const mapsList = state => state.mapsList
export const activeMapTable = state => state.activeMapTable
export const activeAupCode = state => state.activeAupCode
export const isLoadingSaveTable = state => state.isLoadingSaveTable
export const isLoadingTable = state => state.isLoadingTable
export const isLoadingGroups = state => state.isLoadingGroups
export const allGroups = state => state.allGroups
export const buildTable = (state) => {
	const copyTable = _.cloneDeep(state.activeMapTable)
	const columns = _.groupBy(copyTable, 'num_col')

	const sortedColumns = []

	for (const key in columns) {
		sortedColumns.push(_.sortBy(columns[key], ['num_row']))
	}

	return sortedColumns
}
export const allGroupsMapId = state =>
	_.keyBy(state.allGroups, group => group.id)


export const modeTable = state => state.modeTable

export const heightZet = (state, getters) => {
	return (countZet = 1) => {
		switch (state.modeTable) {
			case 'full':
				return `calc(((100vh - 80px - 32px - 30px) / ${getters.maxZet}) * ${countZet})`
				
			default:
				return `calc(90px * ${countZet})`
		}
	}
}

export const maxZet = (state, getters) => {
	let maxZet = 0

	getters.buildTable.forEach(column => {
		let sum = 0
		column.forEach(element => {
			sum += element?.type?.reduce(
				(sum, zetBlock) => sum + zetBlock?.zet,
				0
			)
		})

		if (sum > maxZet) maxZet = sum
	})

	maxZet = Math.ceil(maxZet)

	return maxZet
}