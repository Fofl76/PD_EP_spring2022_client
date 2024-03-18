import type { IUnitsOfMeasurement } from '@models/Maps'

export default interface IFetchMetaInfo {
	measure_coefs: IUnitsOfMeasurement[]

	modes: any // TODO
}
