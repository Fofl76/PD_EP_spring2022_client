import Events from 'events'
import Api from '@services/api/Api'
import tokenService, { TokenService } from './TokenService'
import permissionService from './PermissionService'
import { IUser } from '@models/Auth'
import store from '@store/index'

class AuthService extends Events {
	private tokenService: TokenService

	loggedUser: IUser | null = null

	constructor(tokenService: TokenService) {
		super()
		this.tokenService = tokenService
	}

	async login(payload: { username: string; password: string }) {
		const res = await Api.login(payload)

		if (!res.success) return res

		this.tokenService.emit('tokens-fetched', res.data)

		this.fetchLoggedUser()

		return res
	}

	updateLoggedUser(user: IUser) {
		this.loggedUser = user

		permissionService.setPermissions(user.can_edit, user.faculties)

		store.commit('Map/setAuthStatus', true)
		this.emit('updateUser', user)
	}

	async fetchLoggedUser() {
		const tokenDecoded = this.tokenService.decode()
		if (!tokenDecoded) return null

		this.updateLoggedUser(tokenDecoded)

		return tokenDecoded
	}

	logout() {
		this.tokenService.emit('logout')
		window.location.reload()
	}
}

const authService = new AuthService(tokenService)

Object.defineProperty(window, '_AuthService', { value: AuthService })
Object.defineProperty(window, '_authService', { value: authService })

export default authService
