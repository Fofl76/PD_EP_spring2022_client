import Key from '@models/Key'

export interface ITokens {
	access: string
	refresh: string
}

export interface ITokenPayload {
	exp: number
	faculties: number[]
	role_id: number
	user_id: number
}

export interface IUser {
	id: Key
	login: string
	role: Key
	department: Key
}
