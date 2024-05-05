import type { Key } from '@models/Key'

export interface ITokens {
	access: string
	refresh: string
}

export enum RoleIdEnum {
	Admin = 1,
	Faculty = 2,
	Department = 3,
}

export interface IUser {
	user_id: Key
	login: String
	role_id: Key
	department_id: Key
	faculties: Key[]
	exp: number
	can_edit: Key[]
}
