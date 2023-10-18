import Events from 'events'
import Api from '@services/api/Api'
import tokenService, { TokenService } from './TokenService'

class AuthService extends Events {
	private tokenService: TokenService

	async login(payload: { username: string; password: string }) {
		const resp = await Api.login(payload)

		if (!resp) {
			//TODO вывести сообщение об ошибке
			return
		}

		this.tokenService.emit('tokens-fetched', resp)
	}

	logout() {
		this.tokenService.emit('logout')
		window.location.reload()
	}

	test(aup: string) {
		//временный тест
		Api.test(aup)
	}

	constructor(tokenService: TokenService) {
		super()
		this.tokenService = tokenService
	}
}

const authService = new AuthService(tokenService)
export default authService
