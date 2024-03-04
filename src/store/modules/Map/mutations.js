export const setRightMenuEditWidth = (state, id) =>
	(state.rightMenuEditWidth = id)

export const setRightMenuEditItemId = (state, id) =>
	(state.rightMenuEditItemId = id)

export const setRightMenuEditModel = (state, flag) =>
	(state.rightMenuEditModel = flag)

export const setAuthStatus = (state, status) => (state.isAuth = status)

export const setMode = (state, payload) => (state.currentMode = payload)
