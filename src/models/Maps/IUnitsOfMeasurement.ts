import type { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'

export default interface IUnitsOfMeasurement {
	coef: number
	amount_type: ValueAmountTypeEnum
	kratn: number
	value: string
}
