import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

const moduleData = { namespaced: true, state, getters, mutations, actions }

export default moduleData
