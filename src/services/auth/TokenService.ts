import Events from 'events'
import { ITokens } from '@models/Auth'

export class TokenService extends Events {
	tokens = {
		access: localStorage.getItem('access'),
		refresh: localStorage.getItem('refresh'),
	}

	logout() {
		localStorage.removeItem('access')
		localStorage.removeItem('refresh')
	}

	setTokens(payload: ITokens) {
		this.tokens = payload

		localStorage.setItem('access', payload.access)
		localStorage.setItem('refresh', payload.refresh)
	}
}

const tokenService = new TokenService()
tokenService.on('tokens-fetched', tokenService.setTokens)
tokenService.on('logout', tokenService.logout)

export default tokenService
