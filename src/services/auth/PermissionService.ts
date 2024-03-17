import type { Key } from '@models/Key'
import { RoleIdEnum } from '@models/Auth'
import { type IMode } from '@models/Maps'

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

	canViewFaculty(faculty) {
		// Если не только для админа, то просмотр возможен
		if (faculty.admin_only === false) return true

		// Если только для админа и пользователь с Ролью админ, то тоже можно
		if (faculty.admin_only && this.isRootAdmin()) return true

		// В остальных случаях пока нельзя
		return false
	}

	canEditAup(aupCode: Key) {
		if (!authService.loggedUser) return

		return this.isRootAdmin() || this.availableAupSet.has(aupCode)
	}

	canSelectMode(mode: IMode, aupCode: Key) {
		if (!mode.needPermission) return true

		return this.canEditAup(aupCode)
	}
}

const permissionService = new PermissionService()

Object.defineProperty(window, '_permissionService', {
	value: permissionService,
})

export { PermissionService }
export default permissionService
