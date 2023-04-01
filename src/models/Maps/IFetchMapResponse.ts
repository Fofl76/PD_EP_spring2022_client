import IMapItemRaw from './IMapItemRaw'

interface IFetchMapResponse {
	data: IMapItemRaw[]
	header: string[]
	year: number
}

export default IFetchMapResponse
