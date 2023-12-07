import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'

interface IUnitsOfMeasurement {
	coef: number
	amount_type: ValueAmountTypeEnum
	kratn: number
	value: string
}

export default IUnitsOfMeasurement
