import Events from 'events'
import Api from '@services/api/Api'
import tokenService, { TokenService } from './TokenService'
import { IUser } from '@models/Auth'
import store from '@store/index'

class AuthService extends Events {
	private tokenService: TokenService

	loggedUser: IUser | null = null

	constructor(tokenService: TokenService) {
		super()
		this.tokenService = tokenService
	}

	async login(payload: {
		username: string
		password: string
	}): Promise<'success' | 'error'> {
		const { success, data } = await Api.login(payload)

		if (!success) {
			return 'error'
		}

		this.tokenService.emit('tokens-fetched', data)

		this.fetchLoggedUser()

		return 'success'
	}

	updateLoggedUser(user: IUser) {
		this.loggedUser = user

		store.commit('Map/setAuthStatus', true)
		this.emit('updateUser', user)
	}

	async fetchLoggedUser() {
		const tokenDecoded = this.tokenService.decode()
		if (!tokenDecoded) return null

		const { success, data } = await Api.fetchUser(tokenDecoded.user_id)
		if (success && data) this.updateLoggedUser(data)

		return data
	}

	logout() {
		this.tokenService.emit('logout')
		window.location.reload()
	}
}

const authService = new AuthService(tokenService)
export default authService
