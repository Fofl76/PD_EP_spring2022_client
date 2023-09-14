import Key from '@models/Key'

interface IControlTypeRaw {
	name: string
	id: Key
	type: 'load' | 'control'
}

export default IControlTypeRaw
