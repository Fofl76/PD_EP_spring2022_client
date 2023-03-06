import _ from 'lodash'

export const mapsList = state => state.mapsList
export const activeMapTable = state => state.activeMapTable
export const isLoadingTable = state => state.isLoadingTable
export const isLoadingGroups = state => state.isLoadingGroups
export const allGroups = state => state.allGroups
export const allGroupsMapId = state =>
	_.keyBy(state.allGroups, group => group.id)
