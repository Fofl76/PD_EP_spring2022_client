import Events from 'events'
import Api from '@services/api/Api'
import tokenService, { TokenService } from './TokenService'

class AuthService extends Events {
	private tokenService: TokenService

	async login(payload: {
		username: string
		password: string
	}): Promise<'success' | 'error'> {
		const resp = await Api.login(payload)

		if (!resp) {
			return 'error'
		}

		this.tokenService.emit('tokens-fetched', resp)

		return 'success'
	}

	logout() {
		this.tokenService.emit('logout')
		window.location.reload()
	}

	constructor(tokenService: TokenService) {
		super()
		this.tokenService = tokenService
	}
}

const authService = new AuthService(tokenService)
export default authService
