import type { Key } from '@models/Key'
import { RoleIdEnum } from '@models/Auth'
import authService from './AuthService'

import Events from 'events'

class PermissionService extends Events {
	availableAupSet: Set<Key> = new Set()
	faculties: Key[] = []
	role: RoleIdEnum | null = null

	constructor() {
		super()
	}

	setPermissions(
		availableAupList: Key[],
		faculties: Key[] = [],
		role_id: RoleIdEnum,
	) {
		this.availableAupSet = new Set(availableAupList)
		this.faculties = faculties
		this.role = role_id
	}

	isRootAdmin() {
		return this.role === RoleIdEnum.Admin
	}

	canEditAup(aup) {
		if (!authService.loggedUser) return

		return this.isRootAdmin() || this.availableAupSet.has(aup)
	}
}

const permissionService = new PermissionService()

Object.defineProperty(window, '_permissionService', {
	value: permissionService,
})

export { PermissionService }
export default permissionService
