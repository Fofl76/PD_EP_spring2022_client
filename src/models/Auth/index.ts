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
