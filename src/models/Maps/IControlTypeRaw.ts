import Key from '@models/Key'

const test = 'test'

export default interface IControlTypeRaw {
	name: string
	id: Key
	type: 'load' | 'control'
}
