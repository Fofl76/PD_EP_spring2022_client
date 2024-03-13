import type { Key } from '@models/Key'

export default interface IControlTypeRaw {
	name: string
	id: Key
	type: 'load' | 'control'
}
