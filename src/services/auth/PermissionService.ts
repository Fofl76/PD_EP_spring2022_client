import Key from '@models/Key'
import { RoleIdEnum } from '@models/Auth'
import authService from './AuthService'

import Events from 'events'

class PermissionService extends Events {
	availableAupSet: Set<Key> = new Set()
	faculties: Key[] = []

	constructor() {
		super()
	}

	setPermissions(availableAupList: Key[], faculties: Key[] = []) {
		this.availableAupSet = new Set(availableAupList)
		this.faculties = faculties
	}

	canEditAup(aup) {
		if (!authService.loggedUser) return

		return (
			authService.loggedUser.role_id === RoleIdEnum.Admin ||
			this.availableAupSet.has(aup)
		)
	}
}

const permissionService = new PermissionService()

Object.defineProperty(window, '_permissionService', {
	value: permissionService,
})

export { PermissionService }
export default permissionService
