export const setMapsList = (state, mapsList) => (state.mapsList = mapsList)
export const setActiveMapTable = (state, activeMapTable) =>
	(state.activeMapTable = activeMapTable)

export const setIsLoadingTable = (state, flag) => (state.isLoadingTable = flag)

export const setAllGroups = (state, groups) => (state.allGroups = groups)
export const addGroups = (state, group) => state.allGroups.push(group)
export const setIsLoadingGroups = (state, flag) =>
	(state.isLoadingGroups = flag)

export const moveItem = (state, { currentEl, newNumRow, newNumCol }) => {
	const oldNumCol = currentEl.num_col

	const el = state.activeMapTable.find(el => el.id === currentEl.id)
	el.num_col = newNumCol
	el.num_row = newNumRow

	const oldCol = []
	const newCol = []

	for (const key in state.activeMapTable) {
		if (Object.hasOwnProperty.call(state.activeMapTable, key)) {
			const element = state.activeMapTable[key]

			if (element.id === currentEl.id) {
				continue
			}

			if (element.num_col === oldNumCol && newNumCol !== oldNumCol) {
				oldCol.push(element)
			}

			if (element.num_col === newNumCol) {
				newCol.push(element)
			}
		}
	}

	oldCol.sort((a, b) => a.num_row - b.num_row)
	newCol.sort((a, b) => a.num_row - b.num_row)

	newCol.splice(newNumRow, 0, el)

	oldCol.forEach((el, i) => {
		el.num_row = i
	})

	newCol.forEach((el, i) => {
		el.num_row = i
	})
}

export const setActiveAupCode = (state, aupCode) => {
	state.activeAupCode = aupCode
}

export const setIsLoadingSaveTable = (state, flag) =>
	(state.isLoadingSaveTable = flag)
