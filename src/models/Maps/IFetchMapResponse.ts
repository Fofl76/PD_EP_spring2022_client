import type IMapItemRaw from './IMapItemRaw'

export default interface IFetchMapResponse {
	data: IMapItemRaw[]
	header: string[]
	year: number
}
