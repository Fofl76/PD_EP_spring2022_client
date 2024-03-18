export default interface IMapItemValueRaw {
	amount: number
	amount_type: ValueAmountTypeEnum
	control_type_id: number
	id: number
	type: 'load' | 'control'
}

enum ValueAmountTypeEnum {
	HOUR = 'hour',
	WEEK = 'week',
}

export { type IMapItemValueRaw, ValueAmountTypeEnum }
