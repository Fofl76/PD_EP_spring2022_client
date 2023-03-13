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
