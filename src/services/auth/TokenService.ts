import Events from 'events'
import { ITokens } from '@models/Auth'
import { ITokenPayload } from '@models/Auth'
import jwtDecode from 'jwt-decode'

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

	decode(token?: string) {
		if (token) {
			return jwtDecode<ITokenPayload>(token)
		} else if (this.tokens.access) {
			return jwtDecode<ITokenPayload>(this.tokens.access)
		}

		return null
	}
}

const tokenService = new TokenService()
tokenService.on('tokens-fetched', tokenService.setTokens)
tokenService.on('logout', tokenService.logout)

Object.defineProperty(window, '_tokenService', { value: tokenService })

export default tokenService
