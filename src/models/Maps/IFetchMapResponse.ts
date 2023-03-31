import IFetchAllMapsListResponse from './IFetchAllMapsListResponse'

interface IFetchMapResponse {
	data: IFetchAllMapsListResponse[]
	header: string[]
	year: number
}

export default IFetchMapResponse
